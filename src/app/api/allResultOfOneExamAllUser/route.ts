/**
 * THIS FILL HAS ONE FUNCTION (GET)
 * --- ---
 * ?GET FUNCTION => GET THE RESULTS OF ALL USER OF ONE EXAM
 * ONLY ADMIN CAN RUN THIS FUNCTION
 * --- ---
 */

import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";

/*
 * Method : GET
 * Url : /api/allResultOfOneExamAllUser
 * Private : Private (If User Has Checked JWT)
 */

export async function GET(request: NextRequest) {
  try {
    // Check Token If Admin Or Not
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
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

    // Get The All Questions
    const result = await prisma.resultOfExam.findMany({
      where: {
        testId: parseInt(testId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: {
          select: {
            userName: true,
            tel: true,
          },
        },
        Test: {
          select: {
            GroupOfSection: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    // RETURN A SUCCESSFUL MESSAGE
    return NextResponse.json({ message: result }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
