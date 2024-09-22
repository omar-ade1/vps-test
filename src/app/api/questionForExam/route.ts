import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { z } from "zod";

/*
 * Method : GET
 * Url : /api/questionForExam
 * Private : Private (If User Has Checked JWT)
 */
export async function GET(request: NextRequest) {
  try {
    // Check Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken) {
      return NextResponse.json({ message: "تم رفض الطلب : يجب تسجيل الدخول" }, { status: 403 });
    }

    // Get Id Of Course And Test
    const courseId = request.nextUrl.searchParams.get("courseId");
    const testId = request.nextUrl.searchParams.get("testId");

    // Check The Ids
    if (!courseId || !testId) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(testId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Get The All Questions
    const exam = await prisma.test.findUnique({
      where: {
        id: parseInt(testId),
      },

      include: {
        questions: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            Question: true,
          },
        },
      },
    });

    // Check The Test
    if (!exam) {
      return NextResponse.json({ message: "لم يتم العثور على الاختبار بهذا ال ID" }, { status: 404 });
    }

    // Return The Questions
    return NextResponse.json({ message: exam.questions }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : POST
 * Url : /api/questionForExam
 * Private : private (If User Is Admin)
 */
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

export async function POST(request: NextRequest) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin === false) {
      return NextResponse.json({ message: "تم رفض الطلب : لا تملك صلاحية الوصول لهذا الطلب" }, { status: 403 });
    }

    // Get Id Of Course And Test
    const courseId = request.nextUrl.searchParams.get("courseId");
    const testId = request.nextUrl.searchParams.get("testId");

    // Check Ids
    if (!courseId || !testId) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If There Any Question Bank
    const ifQuestionsBanks = await prisma.questionBank.findMany();
    if (!ifQuestionsBanks) {
      return NextResponse.json({ message: "لم يتم العثور على بنك اسئلة يرجى انشاء بنك اسئلة قبل اضافة اسئلة" }, { status: 404 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(testId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Get The Test By Test Id And Check It
    const checkTest = await prisma.test.findUnique({
      where: {
        id: parseInt(testId),
      },
    });

    // Check The Test
    if (!checkTest) {
      return NextResponse.json({ message: "لم يتم العثور على اختبار برقم ال ID المرسل" }, { status: 404 });
    }

    // Get Inputs From User
    const body: Body = await request.json();
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

    // Validation Inputs
    const validation = bodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

    // Find The Question Bank By Question Bank Id From Inputs And Check It
    const checkQuestionBank = await prisma.questionBank.findUnique({
      where: {
        id: body.questionBankId,
      },
    });

    // Check The Question Bank
    if (!checkQuestionBank) {
      return NextResponse.json({ message: "لم يتم العثور على بنك اسئلة ب ال ID المرسل في الطلب" }, { status: 404 });
    }

    // Create The Question And Return Succeed Message
    const question = await prisma.question.create({
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

    // Then, create the association between the question and the test
    await prisma.testQuestion.create({
      data: {
        testId: parseInt(testId), // ID الخاص بالاختبار
        questionId: question.id, // ID الخاص بالسؤال الذي تم إنشاؤه
      },
    });

    // Return Succeed Message
    return NextResponse.json({ message: "تم انشاء السؤال بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
