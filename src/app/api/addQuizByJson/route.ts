import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/*
 * Method : POST
 * Url : /api/addQuizByJson
 * Private : Private (If User Is Admin)
 */
interface Body {
  questionText: string;
  // questionBankId: number;
  questionSection: string;
  answer1?: string;
  answer2?: string;
  answer3?: string;
  answer4?: string;
  answerTrue: number;
}

interface body2 {
  jsonData: Body[];
}

export async function POST(request: NextRequest) {
  try {
    // Check Token If Admin Or Not
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : يجب تسجيل الدخول" }, { status: 403 });
    }

    // Get Id Of Course And Test
    const courseId = request.nextUrl.searchParams.get("courseId");
    const testId = request.nextUrl.searchParams.get("testId");
    const questionBankId = request.nextUrl.searchParams.get("questionBankId");

    // Check The Ids
    if (!courseId || !testId || !questionBankId) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(testId)) || isNaN(parseInt(questionBankId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم أو بنك الاسئلة غير صالح " }, { status: 400 });
    }

    // GET USER BY ID IN TOKEN
    const checkUser = await prisma.user.findUnique({
      where: {
        id: verfiyToken.id,
        isAdmin: true,
      },
    });

    // CHECK THE USER
    if (!checkUser) {
      return NextResponse.json({ message: "لا يوجد مستخدم بهذا ال ID" }, { status: 404 });
    }

    // GET TEST BY TEST ID
    const checkTest = await prisma.test.findUnique({
      where: {
        id: parseInt(testId),
      },
    });

    // CHECK THE TEST
    if (!checkTest) {
      return NextResponse.json({ message: "لا يوجد اختبار بهذا ال ID" }, { status: 404 });
    }

    // CHECK QUESTION BANK EXIST
    const checkQuestionBank = await prisma.questionBank.findUnique({
      where: {
        id: parseInt(questionBankId),
      },
    });

    if (!checkQuestionBank) {
      return NextResponse.json({ message: "لا يوجد بنك الاسئلة بهذا ال ID" }, { status: 404 });
    }

    const body: body2 = await request.json();
    const jsonData: Body[] = body.jsonData; // استخرج jsonData

    // VALIDATION BODY
    const bodySchema = z.array(
      z.object({
        questionText: z
          .string()
          .min(1, { message: "يجب أن يحتوي السؤال على نص" })
          .min(3, { message: "يجب أن يكون نص السؤال مكونًا من 3 أحرف على الأقل" }),
        // questionBankId: z
        //   .number({ required_error: "يجب أن يحتوي السؤال على معرف بنك" })
        //   .min(1, { message: "يجب أن يكون معرف بنك الأسئلة أكبر من أو يساوي 1" }),
        questionSection: z.string({ required_error: "يجب أن يحتوي السؤال على قسم" }).min(1, { message: "يجب تحديد القسم الخاص بالسؤال" }),
        answer1: z.string({ required_error: "يجب أن يحتوي السؤال على اجابة" }).optional(),
        answer2: z.string({ required_error: "يجب أن يحتوي السؤال على اجابة" }).optional(),
        answer3: z.string({ required_error: "يجب أن يحتوي السؤال على اجابة" }).optional(),
        answer4: z.string({ required_error: "يجب أن يحتوي السؤال على اجابة" }).optional(),
        answerTrue: z
          .number({ required_error: "يجب أن يحتوي السؤال على رقم الإجابة الصحيحة" })
          .min(1, { message: "يجب أن يكون رقم الإجابة الصحيحة بين 1 و 4" })
          .max(4, { message: "يجب أن يكون رقم الإجابة الصحيحة بين 1 و 4" }),
      }),
      { invalid_type_error: "يجب أن يحتوي السؤال على بيانات صالحة" }
    );

    // CHECK THE BODY
    const validation = bodySchema.safeParse(jsonData);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

    // First, create the questions
    for (let i = 0; i < jsonData.length; i++) {
      // First, create the question
      const addQuizByJson = await prisma.question.create({
        data: {
          questionText: jsonData[i].questionText,
          // questionBankId: jsonData[i].questionBankId,
          questionBankId: parseInt(questionBankId),
          questionSection: jsonData[i].questionSection,
          answer1: jsonData[i].answer1,
          answer2: jsonData[i].answer2,
          answer3: jsonData[i].answer3,
          answer4: jsonData[i].answer4,
          asnwerTrue: jsonData[i].answerTrue,
        },
      });

      // Then, create the association between the question and the test
      await prisma.testQuestion.create({
        data: {
          testId: parseInt(testId),
          questionId: addQuizByJson.id,
        },
      });
    }

    // RETURN A SUCCESSFUL MESSAGE
    return NextResponse.json({ message: "تم الاضافة بنجاح" }, { status: 200 });

    // WHILE ERROR
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
