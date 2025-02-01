import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";

/*
 * Method : POST
 * Url : /api/questionForExam
 * Private : private (If User Is Admin)
 */

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
    const questionBankId = request.nextUrl.searchParams.get("questionBankId");
    const questionId = request.nextUrl.searchParams.get("questionId");

    // Check Ids
    if (!courseId || !testId || !questionBankId || !questionId) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(testId)) || isNaN(parseInt(questionBankId)) || isNaN(parseInt(questionId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // Check If There Any Question Bank
    const ifQuestionsBank = await prisma.questionBank.findUnique({
      where: {
        id: parseInt(questionBankId),
      },
    });
    if (!ifQuestionsBank) {
      return NextResponse.json({ message: "ال ID الخاص بـبنك الاسئلة غير صحيح" }, { status: 404 });
    }

    const checkQuestion = await prisma.question.findUnique({
      where: {
        id: parseInt(questionId),
      },
    });
    if (!checkQuestion) {
      return NextResponse.json({ message: "ال ID الخاص بالسؤال غير صحيح" }, { status: 404 });
    }

    const checkIfQuestionInExam = await prisma.testQuestion.findFirst({
      where: {
        testId: parseInt(testId),
        questionId: parseInt(questionId),
      },
    })
    if (checkIfQuestionInExam) {
      return NextResponse.json({ message: "السؤال موجود بالفعل في الاختبار" }, { status: 400 });
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

    // Then, create the association between the question and the test
    await prisma.testQuestion.create({
      data: {
        testId: parseInt(testId), // ID الخاص بالاختبار
        questionId: parseInt(questionId), // ID الخاص بالسؤال الذي تم إنشاؤه
      },
    });

    // Return Succeed Message
    return NextResponse.json({ message: "تم انشاء السؤال بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
