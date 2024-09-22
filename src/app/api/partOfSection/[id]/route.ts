import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { Params } from "@/app/utils/interfaces/Params";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";

/*
 * Method : PUT
 * Url : /api/partOfSection/${id}
 * Private : private (Only Admin)
 */

interface Body {
  title: string;
  details: string;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Check The Token And If He Admin Or Not
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get Ids From Params
    const courseId = request.nextUrl.searchParams.get("courseId");
    const sectionId = request.nextUrl.searchParams.get("sectionId");

    // Check The Ids
    if (!courseId || !sectionId || !params.id) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(sectionId)) || isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(sectionId)) || isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Get Course, Section And Part Of Section And Check If They Are Founded
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
    });

    const section = await prisma.section.findUnique({
      where: {
        id: parseInt(sectionId),
      },
    });

    const partOfSection = await prisma.partOfSection.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!course || !section || !partOfSection) {
      return NextResponse.json({ message: "Id المرسل في الطلب غير صحيح" }, { status: 404 });
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

    // If The User Input Title Is Equal The Section Title
    if (body.title == partOfSection.title && body.details == partOfSection.details) {
      return NextResponse.json({ message: "لم يتم تغيير شئ في البيانات" }, { status: 400 });
    }

    // Update The Section
    const partOfSectionUpdated = await prisma.partOfSection.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        title: body.title || partOfSection.title,
        details: body.details,
      },
    });

    //todo Start Update Path Of Video
    // UPLOAD_DIR For Video Of Course
    const UPLOAD_DIR_VIDEO = path.resolve(process.env.ROOT_PATH ?? "", `public/video`);

    if (fs.existsSync(`${UPLOAD_DIR_VIDEO}/${course.courseName}/${section.title}/${partOfSection.title}`)) {
      fs.rename(
        `${UPLOAD_DIR_VIDEO}/${course.courseName}/${section.title}/${partOfSection.title}`,
        `${UPLOAD_DIR_VIDEO}/${course.courseName}/${section.title}/${partOfSectionUpdated.title}`,
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("done");
          }
        }
      );

      const checkVideos = await prisma.video.findMany({
        where: {
          GroupOfSection: {
            partOfSection: {
              id: partOfSection.id,
            },
          },
        },
      });

      if (checkVideos) {
        const videos = await prisma.video.updateMany({
          where: {
            GroupOfSection: {
              partOfSection: {
                id: partOfSection.id,
              },
            },
          },
          data: {
            partOfSectionName: partOfSectionUpdated.title,
          },
        });

        for (let i = 0; i < videos.count; i++) {
          console.log(true);
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
    //todo End Update Path Of Video

    // Return Success Response
    return NextResponse.json({ message: "تم التحديث بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : DELETE
 * Url : /api/partOfSection/${id}
 * Private : private (Only Admin)
 */

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get Ids From Params
    const courseId = request.nextUrl.searchParams.get("courseId");
    const sectionId = request.nextUrl.searchParams.get("sectionId");

    // check the ids
    if (!courseId || !sectionId || !params.id) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(sectionId)) || isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Get Course, Section And Part Of Section And Check If They Are Founded
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
    });

    const section = await prisma.section.findUnique({
      where: {
        id: parseInt(sectionId),
      },
    });

    const partOfSection = await prisma.partOfSection.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!course || !section || !partOfSection) {
      return NextResponse.json({ message: "Id المرسل في الطلب غير صحيح" }, { status: 404 });
    }

    // UPLOAD_DIR For Video Of Course
    const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", `public/video/${course.courseName}/${section.title}/${partOfSection.title}`);

    // Delete Video Path Of This Part Of Section
    fs.rm(UPLOAD_DIR, { force: true, recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
    });

    // Delete The Part Of Section
    await prisma.partOfSection.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    // Return Succeed Response
    return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
