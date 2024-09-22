import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/*
 * Method : POST
 * Url : /api/mediaSection
 * Private : private (Only Admin)
 */

interface Body {
  title: string;
  details: string;
  type: string;
}

export async function POST(request: NextRequest) {
  try {
    // CHECK TOKEN IS USER IS ADMIN 
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // GET IDS FROM PARAMS IN URL
    const courseId = request.nextUrl.searchParams.get("courseId");
    const sectionId = request.nextUrl.searchParams.get("sectionId");
    const partOfSectionId = request.nextUrl.searchParams.get("partOfSectionId");

    // CHECK THE IDS
    if (!courseId || !sectionId || !partOfSectionId) {
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


    // INPUTS FROM USER
    const body: Body = await request.json();

    // Body Schema
    const bodySchema = z.object({
      title: z
        .string()
        .min(1, { message: "حقل العنوان مطلوب" })
        .min(2, { message: "لا يمكن ان يقل العنوان عن حرفين على الأقل" })
        .max(30, { message: "لا يمكن ان يزيد العنوان عن 30 حرف" }),
      details: z.string().optional(),
      type: z.string().min(1, { message: "يجب اختيار قسم" }),
    });

    // CHECK THE SCHEMA
    const validationSchema = bodySchema.safeParse(body);

    if (!validationSchema.success) {
      return NextResponse.json({ message: validationSchema.error.errors[0].message }, { status: 400 });
    }

    // CREATE A MEDIA SECTION BY TYPE 
    if (body.type === "test") {
      const media = await prisma.test.create({
        data: {
          fullMark: 10,
          allowQuiz: true,
        },
      });

      await prisma.groupOfSection.create({
        data: {
          title: body.title,
          details: body.details,
          type: body.type,
          partOfSectionId: parseInt(partOfSectionId),
          testId: media.id,
        },
      });
    } else if (body.type === "file") {
      const media = await prisma.file.create({
        data: {},
      });

      await prisma.groupOfSection.create({
        data: {
          title: body.title,
          details: body.details,
          type: body.type,
          partOfSectionId: parseInt(partOfSectionId),
          fileId: media.id,
        },
      });
    } else if (body.type === "video") {

      // UPLOAD_DIR FOR VIDEO OF COURSE
      const video = await prisma.groupOfSection.create({
        data: {
          title: body.title,
          details: body.details,
          type: body.type,
          partOfSectionId: parseInt(partOfSectionId),
          Video: {
            create: {},
          },
        },
        include: {
          Video: true,
        },
      });

      
      await prisma.groupOfSection.update({
        where: {
          id: video.id,
        },
        data: {
          videoId: video.Video?.id,
        },
      });
    } else if (body.type === "note") {
      const media = await prisma.note.create({
        data: {},
      });

      await prisma.groupOfSection.create({
        data: {
          title: body.title,
          details: body.details,
          type: body.type,
          partOfSectionId: parseInt(partOfSectionId),
          noteId: media.id,
        },
      });
    }

    // IF ALL OK RETURN STATUS 200 AND MESSAGE
    return NextResponse.json({ message: "تم الانشاء بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
