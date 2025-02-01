import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";

/*
 * Method : GET
 * Url : /api/questionBank/getBankWithOutQuestion
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
