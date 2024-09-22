import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/*
 * Method : POST
 * Url : /api/our-degree
 * Private : private (Only Admin)
 */

interface Body {
  title: string;
  details: string;
  sectionId: number;
}

export async function POST(request: NextRequest) {
  try {
    // Check The Token If Admin
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get Course And Section Id From Url
    const courseId = request.nextUrl.searchParams.get("courseId");
    const sectionId = request.nextUrl.searchParams.get("sectionId");

    // Check Ids
    if (!courseId || !sectionId) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(sectionId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Get The Body Data
    const body: Body = await request.json();

    // Validate The Body Data
    const bodySchema = z.object({
      title: z
        .string()
        .min(1, { message: "حقل العنوان مطلوب" })
        .min(2, { message: "لا يمكن ان يقل العنوان عن حرفين على الأقل" })
        .max(30, { message: "لا يمكن ان يزيد العنوان عن 30 حرف" }),
      details: z.string().optional(),
    });

    // Validate The Body Data Against The Schema
    const validationSchema = bodySchema.safeParse(body);

    // If Validation Failed Return Error Message And Status Code 400
    if (!validationSchema.success) {
      return NextResponse.json({ message: validationSchema.error.errors[0].message }, { status: 400 });
    }

    // Create The Part Of Section
    await prisma.partOfSection.create({
      data: {
        title: body.title,
        details: body.details,
        sectionId: parseInt(sectionId),
      },
    });

    // Return A Successful Message
    return NextResponse.json({ message: "تم الانشاء بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
