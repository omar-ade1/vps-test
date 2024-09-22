import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { Params } from "@/app/utils/interfaces/Params";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Check Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin === false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بهذا الطلب" }, { status: 403 });
    }

    const status = request.nextUrl.searchParams.get("status");

    if (!status) {
      return NextResponse.json({ message: "المعطيات غير كافية لتحديد الحالة" }, { status: 400 });
    }

    // GET COURSE ID FROM PARAMS IN URL
    const courseId = request.nextUrl.searchParams.get("courseId");

    // CHECK COURSE ID
    if (!courseId) {
      return NextResponse.json({ message: "المعطيات غير كافية لم يتم العثور على معرف الكورس" }, { status: 404 });
    }

    // GET COURSE FROM DATA BASE BY ID
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
    });

    // CHECK IF COURSE
    if (!course) {
      return NextResponse.json({ message: "لا يوجد كورس بهذا ID" }, { status: 404 });
    }

    // CHECK IF USER HAS REQUEST IN THIS COURSE OR NOT
    const checkRequest = await prisma.enrollmentRequest.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    if (!checkRequest) {
      return NextResponse.json({ message: "لم يتم العثور على الطلب" }, { status: 404 });
    }

    if (status === "Accepted") {
      // UPDATE REQUEST
      const updateRequest = await prisma.enrollmentRequest.update({
        where: {
          id: checkRequest.id,
        },
        data: {
          status: "Accepted",
        },
      });

      const addUserToCourse = await prisma.user.update({
        where: {
          id: updateRequest.userId,
        },
        data: {
          enrollments: {
            connect: {
              id: parseInt(courseId),
            },
          },
        },
      });

      const deleteRequest = await prisma.enrollmentRequest.delete({
        where: {
          id: updateRequest.id,
        },
      });

      return NextResponse.json({ message: "تمت عملية الاضافة بنجاح" }, { status: 200 });
    } else if (status === "Rejected") {
      // UPDATE REQUEST
      const updateRequest = await prisma.enrollmentRequest.update({
        where: {
          id: checkRequest.id,
        },
        data: {
          status: "Rejected",
        },
      });

      const deleteRequest = await prisma.enrollmentRequest.delete({
        where: {
          id: updateRequest.id,
        },
      });

      return NextResponse.json({ message: "تمت عملية الرفض بنجاح" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "قيمة الحالة غير صحيحة" }, { status: 400 });
    }

    // WHILE ERROR
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
