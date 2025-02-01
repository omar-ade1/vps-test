import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/*
 * Method : PUT
 * Url : /api/questionBank/question
 * Private : private (If User Is Admin)
 */
export async function PUT(request: NextRequest) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin === false) {
      return NextResponse.json({ message: "تم رفض الطلب : لا تملك صلاحية الوصول لهذا الطلب" }, { status: 403 });
    }

    // GET QUESTION ID FROM URL
    const questionId = request.nextUrl.searchParams.get("questionId");

    // Check The Ids
    if (!questionId) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(questionId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Check Question
    const question = await prisma.question.findUnique({
      where: {
        id: parseInt(questionId),
      },
    });
    if (!question) {
      return NextResponse.json({ message: "لا يوجد سؤال بهذا ال ID" }, { status: 404 });
    }

    // INTERFACE BODY DATA
    interface Body {
      questionText: string;
      questionBankId: number;
      questionSection: string;
      answer1?: string;
      answer2?: string;
      answer3?: string;
      answer4?: string;
      answerTrue: number;
    }

    // Get The New Body Data
    const body: Body = await request.json();

    // VALIDATE THE BODY DATA
    const bodySchema = z.object({
      questionText: z
        .string()
        .min(1, { message: "يجب أن يحتوي السؤال على نص" })
        .min(3, { message: "يجب أن يكون نص السؤال مكونًا من 3 أحرف على الأقل" }),
      questionBankId: z.number().min(1, { message: "يجب أن يكون معرف بنك الأسئلة أكبر من أو يساوي 1" }),
      questionSection: z.string().min(1, { message: "يجب تحديد القسم الخاص بالسؤال" }),
      answer1: z.string().optional(),
      answer2: z.string().optional(),
      answer3: z.string().optional(),
      answer4: z.string().optional(),
      answerTrue: z
        .number()
        .min(1, { message: "يجب أن يكون رقم الإجابة الصحيحة بين 1 و 4" })
        .max(4, { message: "يجب أن يكون رقم الإجابة الصحيحة بين 1 و 4" }),
    });

    // Check The Schema
    const validation = bodySchema.safeParse(body);

    // If Validation Failed Return Error
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

    // Update The Question
    await prisma.question.update({
      where: {
        id: parseInt(questionId),
      },
      data: {
        questionText: body.questionText,
        questionBankId: body.questionBankId,
        questionSection: body.questionSection,
        answer1: body.answer1,
        answer2: body.answer2,
        answer3: body.answer3,
        answer4: body.answer4,
        asnwerTrue: body.answerTrue,
      },
    });

    // REUTRN SUCCESSFUL MESSAGE
    return NextResponse.json({ message: "تم تحديث السؤال بنجاح" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : DELETE
 * Url : /api/questionBank/question
 * Private : private (If User Is Admin)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin === false) {
      return NextResponse.json({ message: "تم رفض الطلب : لا تملك صلاحية الوصول لهذا الطلب" }, { status: 403 });
    }

    // Get The Question Id From URL
    const questionId = request.nextUrl.searchParams.get("questionId");

    // Check The Ids
    if (!questionId) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(questionId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Check Question
    const question = await prisma.question.findUnique({
      where: {
        id: parseInt(questionId),
      },
    });
    if (!question) {
      return NextResponse.json({ message: "لا يوجد سؤال بهذا ال ID" }, { status: 404 });
    }

    // Delete The Question
    await prisma.testQuestion.deleteMany({
      where: {
        questionId: parseInt(questionId),
      },
    });
    await prisma.question.delete({
      where: {
        id: parseInt(questionId),
      },
    });

    // REUTRN SUCCESSFUL MESSAGE
    return NextResponse.json({ message: "تم حذف السؤال بنجاح" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
