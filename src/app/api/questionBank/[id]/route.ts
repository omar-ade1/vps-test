import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { z } from "zod";
import { Params } from "@/app/utils/interfaces/Params";

/*
 * Method : GET
 * Url : /api/questionBank/${id}
 * Private : private (If User Is Admin)
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin === false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بهذا الطلب" }, { status: 403 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "نوع ال ID غير صحيح" }, { status: 400 });
    }

    // Get QuestionBank By params.id
    const questionBank = await prisma.questionBank.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    // Check QuestionBank Exists
    if (!questionBank) {
      return NextResponse.json({ message: "لا يوجد بنك اسئلة بهذا ال ID" }, { status: 404 });
    }

    // Return QuestionBank
    return NextResponse.json({ message: questionBank }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

/*
 * Method : PUT
 * Url : /api/questionForExam/${id}
 * Private : private (If User Is Admin)
 */
interface Body {
  name: string;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin === false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بهذا الطلب" }, { status: 403 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "نوع ال ID غير صحيح" }, { status: 400 });
    }

    // GET BODY DATA
    const body: Body = await request.json();

    // VALIDATE BODY DATA
    const bodySchema = z.object({
      name: z.string().min(1, { message: "يجب أن يحتوي الاسم على نص" }).min(3, { message: "يجب أن يكون الاسم مكونًا من 3 أحرف على الأقل" }),
    });

    // CHECK IF BODY DATA IS VALID
    const validation = bodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

    // GET QUESTION BANK WITH PARAMS.ID
    const checkQuestionBank = await prisma.questionBank.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    // Check if Question BANK
    if (!checkQuestionBank) {
      return NextResponse.json({ message: "لا يوجد بنك اسئلة بهذا ال ID" }, { status: 404 });
    }

    // Check If Question Bank Name Is Unique
    const questionBank = await prisma.questionBank.findUnique({
      where: {
        name: body.name,
      },
    });

    // Check if Question Bank Name Is Unique
    if (questionBank) {
      return NextResponse.json({ message: "هناك بنك اسئلة بهذا الاسم يرجى اختيار اسم اخر" }, { status: 404 });
    }

    // Update Question Bank Name
    const newBank = await prisma.questionBank.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name: body.name,
      },
    });

    // REUTRN SUCCESSFUL MESSAGE
    return NextResponse.json({ message: "تم التحديث بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin === false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بهذا الطلب" }, { status: 403 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "نوع ال ID غير صحيح" }, { status: 400 });
    }

    // GET QUESTION BANK WITH PARAMS.ID
    const checkQuestionBank = await prisma.questionBank.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    
    // Check if Question Bank Exists
    if (!checkQuestionBank) {
      return NextResponse.json({ message: "لا يوجد بنك اسئلة بهذا ال ID" }, { status: 404 });
    }

    // Delete Question Bank
    await prisma.questionBank.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    // REUTRN SUCCESSFUL MESSAGE
    return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
