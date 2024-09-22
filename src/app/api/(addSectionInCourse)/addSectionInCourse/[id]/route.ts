/**
 * THIS FILE HAS 3 FUNCTIONS (GET, PUT, DELETE)
 * ---
 * ? GET FUNCTION => GET SINGLE SECTION WITH HIS PART OF SECTION AND GROUP OF SECTION
 * FIXME: ANY USER HAS TOKEN CAN RUN THIS FUNCTION
 * TODO: ONLY USERS IN THIS COURSE CAN RUN THIS FUNCTION
 * ---
 * ? PUT FUNCTION => UPDATE SINGLE SECTION AND THE PATH OF VIDEOS IF THIS SECTION HAS VIDEOS
 * ONLY ADMIN CAN RUN THIS FUNCTION
 * ---
 * ? DELETE FUNCTION => DELETE SINGLE SECTION AND THE PATH OF VIDEOS IF THEIS SECTION HAS VIDEOS
 * ONLY ADMIN CAN RUN THIS FUNCTION
 */

import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { z } from "zod";

interface Props {
  params: {
    id: string;
  };
}

/*
 * Method : GET
 * Url : /api/addSectionInCourse/${id}
 * Private : private (Only Admin)
 */

export async function GET(request: NextRequest, { params }: Props) {
  try {
    // Check The Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken) {
      return NextResponse.json({ message: "يجب تسجيل الدخول للعرض" }, { status: 403 });
    }

    // Check If Ids Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "لا يوجد دورة او قسم بهذا ال Id" }, { status: 404 });
    }

    // Check The Params Id
    if (!params.id) {
      return NextResponse.json({ message: "لا توجد قسم بهذا ال ID" }, { status: 404 });
    }

    // GET SECTION BY ID IN PARAMS
    const section = await prisma.section.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        partOfSection: {
          include: {
            GroupOfSection: true,
          },
        },
      },
    });

    // RETURN SECTION SUCCESSFULY
    return NextResponse.json({ message: section }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
/*
 * Method : PUT
 * Url : /api/addSectionInCourse/${id}
 * Private : private (Only Admin)
 */

interface Body {
  title: string;
  details: string;
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    // Check The Token And If He Admin Or Not
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get The Ids Of Course And Section
    const idOfCourse = request.nextUrl.searchParams.get("courseId");
    const idOfSection = params.id;

    // Check If Ids Of Course And Section Or Not
    if (!idOfCourse) {
      return NextResponse.json({ message: "لم يتم العثور على ID الخاص بالدورة" }, { status: 404 });
    }
    if (!idOfSection) {
      return NextResponse.json({ message: "لا توجد قسم بهذا ال ID" }, { status: 404 });
    }

    // Check If Ids Is Able To Convert To Number
    try {
      if (isNaN(parseInt(idOfCourse)) || isNaN(parseInt(idOfSection))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "لا يوجد دورة او قسم بهذا ال Id" }, { status: 404 });
    }

    // Get The Course From Database
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(idOfCourse),
      },
      include: {
        sections: true,
      },
    });

    // Check If Course Or Not
    if (!course) {
      return NextResponse.json({ message: "لا توجد دورة بهذا ال ID" }, { status: 404 });
    }

    const body: Body = await request.json();

    // The Schema For Inputs
    const bodySchema = z.object({
      title: z
        .string()
        .min(1, { message: "يجب اعطاء قيمة للعنوان" })
        .min(3, { message: "يجب ان يحتوي العنوان على 3 حروف على الاقل" })
        .max(30, { message: "لا يمكن ان يزيد العنوان عن 30 حرف" })
        .optional(),
      details: z.string().optional(),
    });

    // Check The Schema
    const validaition = bodySchema.safeParse(body);
    if (!validaition.success) {
      return NextResponse.json({ message: validaition.error.errors[0].message }, { status: 400 });
    }

    // Get Section From Database
    const section = await prisma.section.findUnique({
      where: {
        id: parseInt(idOfSection),
      },
    });

    // Check If Section Or Not
    if (!section) {
      return NextResponse.json({ message: "لا يوجد قسم بهذا ال id" }, { status: 404 });
    }

    // If The User Input Title Is Equal The Section Title
    if (body.title == section.title && body.details == section.details) {
      return NextResponse.json({ message: "العنوان المدخل موجود بالفعل في هذا القسم. يرجى استخدام عنوان مختلف." }, { status: 400 });
    }

    // Update The Section
    const sectionUpdate = await prisma.section.update({
      where: {
        id: parseInt(idOfSection),
      },
      data: {
        title: body.title || section.title,
        details: body.details,
      },
    });

    //  Update Path Of Video

    // UPLOAD_DIR For Video Of Course
    const UPLOAD_DIR_VIDEO = path.resolve(process.env.ROOT_PATH ?? "", `public/video`);

    // CHECK IF THE PATH IS EXISTS OR NOT
    if (fs.existsSync(`${UPLOAD_DIR_VIDEO}/${course.courseName}/${section.title}`)) {
      // IF TRUE

      // RENAME THE FOLDER TO THE SAME NAME OF SECTION
      fs.rename(
        `${UPLOAD_DIR_VIDEO}/${course.courseName}/${section.title}`,
        `${UPLOAD_DIR_VIDEO}/${course.courseName}/${sectionUpdate.title}`,
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("done");
          }
        }
      );

      // GET VIDEOS OF THIS SECTION
      const checkVideos = await prisma.video.findMany({
        where: {
          GroupOfSection: {
            partOfSection: {
              Section: {
                id: section.id,
              },
            },
          },
        },
      });

      // CHECK IF THIS SECTION HAS VIDEOS OR NOT
      if (checkVideos) {
        // WHILL TRUE UPDATE ALL SECTION NAME FILLD IN ALL VIDEOS MODAL IN THIS SECTION
        const videos = await prisma.video.updateMany({
          where: {
            GroupOfSection: {
              partOfSection: {
                Section: {
                  id: section.id,
                },
              },
            },
          },
          data: {
            sectionName: sectionUpdate.title,
          },
        });

        // FOR NUMBER OF VIDEOS IN THIS SECTION
        for (let i = 0; i < videos.count; i++) {
          // GET THE VIDEO BY SECTION ID AND EVERY TIME SKIP ONE
          const singleVideo = await prisma.video.findFirst({
            where: {
              GroupOfSection: {
                partOfSection: {
                  Section: {
                    id: section.id,
                  },
                },
              },
            },
            skip: i,
          });

          // UPDATE VIDEO URL IN SINGLE VIDEO TO THE NEW URL
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

    // Return Successful Response
    return NextResponse.json({ message: "تم التحديث بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : DELETE
 * Url : /api/addSectionInCourse/${id}
 * Private : private (Only Admin)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Check The Token And If He Admin Or Not
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get The Ids Of Course And Section
    const idOfCourse = request.nextUrl.searchParams.get("courseId");
    const idOfSection = params.id;

    // Check If Ids Of Course And Section Or Not
    if (!idOfCourse) {
      return NextResponse.json({ message: "لم يتم العثور على ID الخاص بالدورة" }, { status: 404 });
    }
    if (!idOfSection) {
      return NextResponse.json({ message: "لا توجد قسم بهذا ال ID" }, { status: 404 });
    }

    // Check If Ids Is Able To Convert To Number
    try {
      if (isNaN(parseInt(idOfCourse)) || isNaN(parseInt(idOfSection))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "لا يوجد دورة او قسم بهذا ال Id" }, { status: 404 });
    }

    // Get The Course From Database
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(idOfCourse),
      },
      include: {
        sections: true,
      },
    });

    // Check If Course Or Not
    if (!course) {
      return NextResponse.json({ message: "لا توجد دورة بهذا ال ID" }, { status: 404 });
    }

    // Get Section From Database
    const section = await prisma.section.findUnique({
      where: {
        id: parseInt(idOfSection),
      },
    });

    // Check If Section Or Not
    if (!section) {
      return NextResponse.json({ message: "لا يوجد قسم بهذا ال id" }, { status: 404 });
    }

    // UPLOAD_DIR For Video Of Course
    const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", `public/video/${course.courseName}/${section.title}`);

    // If MediaSection Is Video, Video Id Is Founded And UrlOf Video Is Founded
    // Delete The Floder Of Video From System
    fs.rm(UPLOAD_DIR, { force: true, recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
    });

    // DELETE THE SECTION
    await prisma.section.delete({
      where: {
        id: parseInt(idOfSection),
      },
    });

    // Return Success Response
    return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
