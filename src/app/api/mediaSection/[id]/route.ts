/**
 * THIS FILE HAS THREE FUNCTION (GET, PUT AND DELETE)
 *
 * ? * GET FUNCTION *
 * GET FUNCTION FOR GET A SINGLE MEDIA SECTION WITH HIS SECTION (FILE, TEST, VIDEO OR NOTE )
 * TODO THIS IS ONLY ALLOW IF USER HAS JWT AND HE IS CONFIRM
 *
 * !===============================
 * !===============================
 *
 * ? * PUT FUNCTION *
 * PUT FUNCTION FOR UPDATE MEDIA SECTION WITH HIS SECTION (FILE, TEST, VIDEO OR NOTE ) AND THE PATH OF VIDEOS IS THIS MEDIA SECTION IS A VIDEO
 * THIS IS ONLY ALLOW IF USER IS ADMIN
 *
 * !===============================
 * !===============================
 *
 * ? * DELETE FUNCTION *
 * DELETE FUNCTION FOR DELETE MEDIA SECTION WITH HIS SECTION (FILE, TEST, VIDEO OR NOTE )
 * THIS IS ONLY ALLOW IF USER IS ADMIN
 */

import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { Params } from "@/app/utils/interfaces/Params";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";

/*
 * Method : GET
 * Url : /api/mediaSection/${id}
 * Private : private (Only JWT And Confirm)
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Check The Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken) {
      return NextResponse.json({ message: "تم رفض الطلب : يجب تسجيل الدخول لتصفح الدورات" }, { status: 403 });
    }

    // GET THE IDS FROM PARAMS IN URL
    const courseId = request.nextUrl.searchParams.get("courseId");
    const sectionId = request.nextUrl.searchParams.get("sectionId");
    const partOfSectionId = request.nextUrl.searchParams.get("partOfSectionId");
    const type = request.nextUrl.searchParams.get("type");

    // CHECK THE IDS
    if (!courseId || !sectionId || !partOfSectionId || !type) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(sectionId)) || isNaN(parseInt(partOfSectionId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "لا يوجد دورة بهذا ال Id" }, { status: 400 });
    }

    // INCLUDE THE (TEST OR FILE OR VIDEO OR NOTE) SECTION BY TYPE
    let include: any;
    if (type === "test") {
      include = {
        Test: true,
      };
    } else if (type === "file") {
      include = {
        File: true,
      };
    } else if (type === "video") {
      include = {
        Video: true,
      };
    } else if (type === "note") {
      include = {
        Note: true,
      };
    }

    // GET THE COURSE BY PARAMS.ID
    const mediaSection = await prisma.groupOfSection.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: include,
    });

    // Check If The Course Exists
    if (!mediaSection) {
      return NextResponse.json({ message: "لا يوجد قسم بهذا ال Id" }, { status: 404 });
    }

    // RETURN SUCCESSFUL MESSAGE
    return NextResponse.json({ message: mediaSection }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : PUT
 * Url : /api/mediaSection/${id}
 * Private : private (Only Admin)
 */

interface Body {
  title: string;
  details: string;
  fullMark: number;
  allowForStudent: boolean;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Check The Token If Admin
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get Ids Of Course, Section And Part Of Section Id From Params In Url
    const courseId = request.nextUrl.searchParams.get("courseId");
    const sectionId = request.nextUrl.searchParams.get("sectionId");
    const partOfSectionId = request.nextUrl.searchParams.get("partOfSectionId");
    const type = request.nextUrl.searchParams.get("type");

    // Check Ids
    if (!courseId || !sectionId || !partOfSectionId || !type) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Ids Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(sectionId)) || isNaN(parseInt(partOfSectionId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "لا يوجد دورة بهذا ال Id" }, { status: 400 });
    }

    // Inputs From Admin
    const body: Body = await request.json();

    // Schema For Body Inputs
    const bodySchema = z.object({
      title: z.string().min(1, { message: "حقل اسم الاختبار مطلوب" }).max(30, { message: "لا يمكن ان يزيد اسم الاختبار عن 30 حرف" }),
      details: z.string().optional(),
      fullMark: z.number().min(1, { message: "حقل الدرجات الكلية مطلوب" }).optional(),
      allowForStudent: z.boolean(),
    });

    // Check The Schema
    const validation = bodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

    // Get The MediaSection And Check If It Exists Or Not
    const mediaSectionCheck = await prisma.groupOfSection.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        partOfSection: {
          include: {
            Section: {
              include: {
                Course: true,
              },
            },
          },
        },
      },
    });
    if (!mediaSectionCheck) {
      return NextResponse.json({ message: "لا يوجد قسم بهذا ال Id" }, { status: 404 });
    }

    // Update Media Section By Type
    if (type == "test") {
      await prisma.groupOfSection.update({
        where: {
          id: parseInt(params.id),
        },
        data: {
          title: body.title,
          details: body.details,
          Test: {
            update: {
              allowQuiz: body.allowForStudent,
              fullMark: body.fullMark,
            },
          },
        },
      });

      // UPDATE VIDEO
    } else if (type == "video") {
      const mediaSectionUpdated = await prisma.groupOfSection.update({
        where: {
          id: parseInt(params.id),
        },
        data: {
          title: body.title,
          details: body.details,
          Video: {
            update: {
              allowForStudent: body.allowForStudent,
            },
          },
        },
      });

      // Update Path Of Video
      // UPLOAD_DIR For Video Of Course
      const UPLOAD_DIR_VIDEO = path.resolve(process.env.ROOT_PATH ?? "", `public/video`);

      // CHECK IF THE PATH IS EXISTS OR NOT
      if (
        // RENAME THE FOLDER TO THE SAME NAME OF SECTION
        fs.existsSync(
          `${UPLOAD_DIR_VIDEO}/${mediaSectionCheck.partOfSection.Section.Course.courseName}/${mediaSectionCheck.partOfSection.Section.title}/${mediaSectionCheck.partOfSection.title}/${mediaSectionCheck.title}`
        )
      ) {
        // IF TRUE

        // RENAME THE FOLDER TO THE SAME NAME OF SECTION
        fs.rename(
          `${UPLOAD_DIR_VIDEO}/${mediaSectionCheck.partOfSection.Section.Course.courseName}/${mediaSectionCheck.partOfSection.Section.title}/${mediaSectionCheck.partOfSection.title}/${mediaSectionCheck.title}`,
          `${UPLOAD_DIR_VIDEO}/${mediaSectionCheck.partOfSection.Section.Course.courseName}/${mediaSectionCheck.partOfSection.Section.title}/${mediaSectionCheck.partOfSection.title}/${mediaSectionUpdated.title}`,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("done");
            }
          }
        );

        // GET VIDEO OF THIS MEDIA SECTION
        const checkVideos = await prisma.video.findMany({
          where: {
            GroupOfSection: {
              id: mediaSectionCheck.id,
            },
          },
        });

        // CHECK IF THIS MEDIA SECTION HAS VIDEOS OR NOT
        if (checkVideos) {
          // WHILL TRUE UPDATE ALL MEDIA SECTION NAME FILLD IN ALL VIDEOS MODAL IN THIS MEDIA SECTION
          const videos = await prisma.video.updateMany({
            where: {
              GroupOfSection: {
                id: mediaSectionCheck.id,
              },
            },
            data: {
              mediaSectionName: mediaSectionUpdated.title,
            },
          });

          // FOR NUMBER OF VIDEOS IN THIS MEDIA SECTION
          for (let i = 0; i < videos.count; i++) {
            // GET THE VIDEO BY MEDIA SECTION ID AND EVERY TIME SKIP ONE
            const singleVideo = await prisma.video.findFirst({
              where: {
                GroupOfSection: {
                  id: mediaSectionCheck.id,
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

      // UPDATE FILE
    } else if (type == "file") {
      await prisma.groupOfSection.update({
        where: {
          id: parseInt(params.id),
        },
        data: {
          title: body.title,
          details: body.details,
          File: {
            update: {
              allowForStudent: body.allowForStudent,
            },
          },
        },
      });

      // UPDATE NOTE
    } else if (type == "note") {
      await prisma.groupOfSection.update({
        where: {
          id: parseInt(params.id),
        },
        data: {
          title: body.title,
          details: body.details,
          Note: {
            update: {
              allowForStudent: body.allowForStudent,
            },
          },
        },
      });

      // WHILL ERROR
    } else {
      return NextResponse.json({ message: "خطأ في ايجاد نوع القسم" }, { status: 400 });
    }

    // Return Successful Message
    return NextResponse.json({ message: "تم التحديث بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : DELETE
 * Url : /api/mediaSection/${id}
 * Private : private (Only Admin)
 */

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check The Token If Admin
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get Ids Of Course, Section And Part Of Section Id From Params In Url
    const courseId = request.nextUrl.searchParams.get("courseId");
    const sectionId = request.nextUrl.searchParams.get("sectionId");
    const partOfSectionId = request.nextUrl.searchParams.get("partOfSectionId");
    const type = request.nextUrl.searchParams.get("type");

    // Check Ids
    if (!courseId || !sectionId || !partOfSectionId || !type) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Ids Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(sectionId)) || isNaN(parseInt(partOfSectionId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "لا يوجد دورة بهذا ال Id" }, { status: 400 });
    }

    // Get The MediaSection And Check If It Exists Or Not
    const mediaSectionCheck = await prisma.groupOfSection.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        partOfSection: {
          include: {
            Section: {
              include: {
                Course: true,
              },
            },
          },
        },
        Video: true,
      },
    });
    if (!mediaSectionCheck) {
      return NextResponse.json({ message: "لا يوجد قسم بهذا ال Id" }, { status: 404 });
    }

    // UPLOAD_DIR For Video Of Course
    const UPLOAD_DIR = path.resolve(
      process.env.ROOT_PATH ?? "",
      `public/video/${mediaSectionCheck.partOfSection.Section.Course.courseName}/${mediaSectionCheck.partOfSection.Section.title}/${mediaSectionCheck.partOfSection.title}/${mediaSectionCheck.title}`
    );

    // If MediaSection Is Video, Video Id Is Founded And UrlOf Video Is Founded
    if (type === "video" && mediaSectionCheck.videoId) {
      if (mediaSectionCheck.Video?.videoUrl) {
        // Delete The Floder Of Video From System
        fs.rm(UPLOAD_DIR, { force: true, recursive: true }, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      // Delete The Video From Database
      await prisma.video.delete({
        where: {
          id: mediaSectionCheck.videoId,
        },
      });
    }

    // Delete Media Section By Type
    await prisma.groupOfSection.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    // Return Successful Message
    return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
