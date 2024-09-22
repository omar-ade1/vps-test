import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/*
 * Method : GET
 * Url : /api/resultOfExam
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

    // Check If User Exist And Has The Permission
    const checkUser = await prisma.user.findUnique({
      where: {
        id: verfiyToken.id,
      },
    });


    if (!checkUser) {
      return NextResponse.json({ message: "لا يوجد مستخدم بهذا ال ID" }, { status: 404 });
    }

    // Get Test By Test Id
    const checkTest = await prisma.test.findUnique({
      where: {
        id: parseInt(testId),
      },
    });

    // Check The Test
    if (!checkTest) {
      return NextResponse.json({ message: "لا يوجد اختبار بهذا ال ID" }, { status: 404 });
    }

    // Get The All Questions
    const result = await prisma.resultOfExam.findMany({
      where: {
        testId: parseInt(testId),
        userId: verfiyToken.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Return All Result Of Exam FOR ONE USER
    return NextResponse.json({ message: result }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : POST
 * Url : /api/resultOfExam
 * Private : private (If User Is Admin)
 */

interface Body {
  allResult: number;
  wrongAnswer: number;
  correctAnswer: number;
}

export async function POST(request: NextRequest) {
  try {
    // Check Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken) {
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
    
    // CREATE A NEW RESULT OF EXAM
    const result = await prisma.resultOfExam.create({
      data: {
        allResult: body.allResult,
        correctAnswer: body.correctAnswer,
        wrongAnswer: body.wrongAnswer,
        testId: parseInt(testId),
        userId: verfiyToken.id,
      },
    });

    // Return The Result Of Exam
    return NextResponse.json({ message: "تم حساب النتيجة بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
