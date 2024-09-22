import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { Params } from "@/app/utils/interfaces/Params";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Check Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken) {
      return NextResponse.json({ message: "تم رفض الطلب : يجب تسجيل الدخول" }, { status: 403 });
    }

    // GET USER BY ID IN PARAMS
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(params.id),
      },
      select: {
        EnrollmentRequest: true,
        enrollments: true,
        isAdmin: true,
      },
    });

    // IF NO USER RETURN ERROR MESSAGE
    if (!user) {
      return NextResponse.json({ message: "لم يتم العثور على المستخدم" }, { status: 404 });
    }

    // RETURN USER DATA
    return NextResponse.json({ message: user }, { status: 200 });

    // WHILL ERROR
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
