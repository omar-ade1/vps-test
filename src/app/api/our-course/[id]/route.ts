import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/app/utils/prismaClient";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/our-courses");

interface Props {
  params: {
    id: string;
  };
}

/*
 * Method : GET
 * Url : /api/our-course/${id}
 * Private : public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    // Check The Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken) {
      return NextResponse.json({ message: "تم رفض الطلب : يجب تسجيل الدخول لتصفح الدورات" }, { status: 403 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "لا يوجد دورة بهذا ال Id" }, { status: 400 });
    }

    // Get The course By params.id
    const theCourse = await prisma.course.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        sections: {
          orderBy: {
            id: "desc",
          },
        },
      },
    });

    // Check If The Course Exists
    if (!theCourse) {
      return NextResponse.json({ message: "لا يوجد دورة بهذا ال Id" }, { status: 404 });
    }

    // GET The Course AND RETURN The Course
    return NextResponse.json({ message: theCourse }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : PUT
 * Url : /api/our-course/${id}
 * Private : private (Only Admin)
 */

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    // Check The Token USER IS ADMIN OR NOT
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || !verfiyToken.isAdmin) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال id غير صالح" }, { status: 400 });
    }

    // Get The course By params.id
    const theCourse = await prisma.course.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    // Check If The Course Exists
    if (!theCourse) {
      return NextResponse.json({ message: "لا يوجد دورة بهذا ال Id" }, { status: 404 });
    }

    // The Data from Front End
    const formData = await request.formData();
    const courseName = formData.get("courseName") as string;
    const courseSubName = formData.get("courseSubName") as string;

    // Convert The Form Data To Javascript Object
    const bodyFormData = Object.fromEntries(formData);
    const file = (bodyFormData.file as Blob) || null;

    // FIND THE Course
    const checkCourse = await prisma.course.findUnique({
      where: {
        courseName: courseName,
      },
    });

    // Check If New Course Name Is The Same As The Old One
    if (checkCourse) {
      return NextResponse.json({ message: "هناك دورة اخرى بنفس الاسم لا يمكن ان يكون هناك اكثر من دورة بنفس الاسم" }, { status: 400 });
    }

    // Check If File
    if (file && file instanceof File) {
      // Check If Any Course In Data Base Have The Same Name With The Img That User Want To Upload It
      const checkTheImg = await prisma.course.findUnique({
        where: {
          courseImg: (bodyFormData.file as File).name,
        },
      });
      if (checkTheImg) {
        return NextResponse.json(
          { message: "هناك صورة بنفس اسم هذه الصورة التي تريد تحميلها , لا يمكن تحميل صور متعددة بنفس الاسم" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // If No our-course File Create It
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      // Write The File That Was Uploaded By Input
      fs.writeFileSync(path.resolve(UPLOAD_DIR, (bodyFormData.file as File).name), buffer);

      // Delete The Image From System
      fs.unlink(path.join(UPLOAD_DIR, theCourse.courseImg), (err) => {
        if (err) {
          console.error("خطأ أثناء حذف الصورة القديمة:", err);
          return NextResponse.json({ message: "فشل في حذف الصورة القديمة" }, { status: 500 });
        }
      });
    }

    // Update The Course With A New Data
    const updatedCourse = await prisma.course.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        courseName: courseName || theCourse.courseName,
        courseSubName: courseSubName || theCourse.courseSubName,
        courseImg: (bodyFormData.file as File).name || theCourse.courseImg,
      },
    });

    // UPLOAD_DIR For Video Of Course
    const UPLOAD_DIR_VIDEO = path.resolve(process.env.ROOT_PATH ?? "", `public/video`);

    // CHECK THE VIDEO PATH IS EXISTING OR NOT
    if (fs.existsSync(`${UPLOAD_DIR_VIDEO}/${theCourse.courseName}`)) {
      
      // Rename The Video File
      fs.rename(`${UPLOAD_DIR_VIDEO}/${theCourse.courseName}`, `${UPLOAD_DIR_VIDEO}/${updatedCourse.courseName}`, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("done");
        }
      });

      // FIND VIDEOS THAT HAVE THE SAME COURSE ID 
      const checkVideos = await prisma.video.findMany({
        where: {
          GroupOfSection: {
            partOfSection: {
              Section: {
                courseId: updatedCourse.id,
              },
            },
          },
        },
      });

      // UPDATE VIDEOS WITH NEW COURSE NAME IF VIDEOS ARE FOUNDED
      if (checkVideos) {
        const videos = await prisma.video.updateMany({
          where: {
            GroupOfSection: {
              partOfSection: {
                Section: {
                  courseId: updatedCourse.id,
                },
              },
            },
          },
          data: {
            courseName: updatedCourse.courseName,
          },
        });

        // LOOP INTO VIDEO AND UPDATE VIDEO DATA WITH NEW URL AND COURSE NAME
        for (let i = 0; i < videos.count; i++) {
          console.log(true);
          const singleVideo = await prisma.video.findFirst({
            where: {
              GroupOfSection: {
                partOfSection: {
                  Section: {
                    courseId: updatedCourse.id,
                  },
                },
              },
            },
            skip: i,
          });

          // UPDATE VIDEO URL WITH NEW COURSE NAME
          const updateSingleVideo = await prisma.video.update({
            where: {
              id: singleVideo?.id,
            },
            data: {
              videoUrl: `${singleVideo?.courseName}/${singleVideo?.sectionName}/${singleVideo?.partOfSectionName}/${singleVideo?.mediaSectionName}/${singleVideo?.videoName}/`,
            },
          });
        }
      }
    }

    // Return Success Message With Status 200
    return NextResponse.json({ message: "تم تحديث الكورس بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    console.error("خطأ داخلي في السيرفر:", error);
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : DELETE
 * Url : /api/our-course/${id}
 * Private : private (Only Admin)
 */

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Check The Token IS USER IS ADMIN OR NOT
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || !verfiyToken.isAdmin) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال id غير صالح" }, { status: 400 });
    }

    // Get The Name Of course By params.id
    const Thecourse = await prisma.course.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    // Check If Image Exists
    if (!Thecourse) {
      return NextResponse.json({ message: "لا يوجد دورة بهذا ال Id" }, { status: 404 });
    }

    // UPLOAD_DIR For Video Of Course
    const UPLOAD_DIR_VIDEO = path.resolve(process.env.ROOT_PATH ?? "", `public/video/${Thecourse.courseName}`);

    // Delete Video Path Of This Course
    fs.rm(UPLOAD_DIR_VIDEO, { force: true, recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
    });

    // Delete The Image From System
    fs.unlink(path.join(UPLOAD_DIR, Thecourse.courseImg), (err) => {
      if (err) {
        console.error("خطأ أثناء حذف الملف:", err);
        return NextResponse.json({ message: "فشل في حذف الملف" }, { status: 500 });
      }
    });

    // Delete The Course From Database
    await prisma.course.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    // Return Success Message With Status 200
    return NextResponse.json({ message: "تم حذف الدورة بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    console.error("خطأ داخلي في السيرفر:", error);
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
