import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { z } from "zod";

/*
 * Method : GET
 * Url : /api/questionBank
 * Private : private (If User Are Admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin === false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بهذا الطلب" }, { status: 403 });
    }

    // Get All Question Bank From Database
    const questionBank = await prisma.questionBank.findMany();

    // Return The Question Bank To The Client
    return NextResponse.json({ message: questionBank }, { status: 200 });

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
  name: string;
  // questionBankId: number;
}

export async function POST(request: NextRequest) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin === false) {
      return NextResponse.json({ message: "تم رفض الطلب : لا تملك صلاحية الوصول لهذا الطلب" }, { status: 403 });
    }

    // Get Body From Request
    const body: Body = await request.json();

    // Validate Body
    const bodySchema = z.object({
      name: z.string().min(1, { message: "يجب أن يحتوي الاسم على نص" }).min(3, { message: "يجب أن يكون الاسم مكونًا من 3 أحرف على الأقل" }),
    });

    // Check If Question Bank Name Exist
    const validation = bodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

    // Check If Question Bank Name Exist
    const questionBank = await prisma.questionBank.findUnique({
      where: {
        name: body.name,
      },
    });

    // Check if Question Bank Name Exist
    if (questionBank) {
      return NextResponse.json({ message: "هناك بنك اسئلة بهذا الاسم يرجى اختيار اسم اخر" }, { status: 404 });
    }

    // Create New Question Bank In Database
    const newBank = await prisma.questionBank.create({
      data: {
        name: body.name,
      },
    });

    // Return SUCCESSFUL MESSAGE
    return NextResponse.json({ message: "تم الانشاء بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
