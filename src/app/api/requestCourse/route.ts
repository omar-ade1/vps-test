import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   try {
//     // Check Token
//     const verfiyToken = tokenInfo() as jwtPayLoad;
//     if (!verfiyToken || verfiyToken.isAdmin === false) {
//       return NextResponse.json({ message: "تم رفض الطلب : غير مسموح لك بهذا الطلب" }, { status: 403 });
//     }

//     // GET COURSE ID FROM PARAMS IN URL
//     const courseId = request.nextUrl.searchParams.get("courseId");

//     // CHECK COURSE ID
//     if (!courseId) {
//       return NextResponse.json({ message: "المعطيات غير كافية لم يتم العثور على معرف الكورس" }, { status: 404 });
//     }

//     // GET COURSE FROM DATA BASE BY ID
//     const course = await prisma.course.findUnique({
//       where: {
//         id: parseInt(courseId),
//       },
//     });

//     // CHECK IF COURSE
//     if (!course) {
//       return NextResponse.json({ message: "لا يوجد كورس بهذا ID" }, { status: 404 });
//     }

//     // CHECK IF USER HAS REQUEST IN THIS COURSE OR NOT
//     const checkRequest = await prisma.enrollmentRequest.findFirst({
//       where: {
//         courseId: parseInt(courseId),
//         userId: verfiyToken.id,
//       },
//     });
//     if (checkRequest) {
//       return NextResponse.json({ message: "يوجد طلب بنفس رقم المعرف الخاص بالمستخدم و الكورس" }, { status: 400 });
//     }

//     // SEND REQUEST AND
//     const sendRequest = await prisma.enrollmentRequest.create({
//       data: {
//         courseId: parseInt(courseId),
//         userId: verfiyToken.id,
//       },
//     });

//     // RETURN SUCCESS MESSAGE
//     return NextResponse.json({ message: "تم ارسال طلب الانضمام بنجاح في انتظار موافقة المشرف" }, { status: 200 });

//     // WHILE ERROR
//   } catch (error) {
//     return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    // Check Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken) {
      return NextResponse.json({ message: "تم رفض الطلب : يجب تسجيل الدخول" }, { status: 403 });
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
    const checkRequest = await prisma.enrollmentRequest.findFirst({
      where: {
        courseId: parseInt(courseId),
        userId: verfiyToken.id,
      },
    });
    if (checkRequest) {
      return NextResponse.json({ message: "يوجد طلب بنفس رقم المعرف الخاص بالمستخدم و الكورس" }, { status: 400 });
    }

    const checkIfUserIsSubscriber = await prisma.user.findUnique({
      where: {
        id: verfiyToken.id,
        enrollments: {
          some: {
            id: parseInt(courseId),
          },
        },
      },
    });

    if (checkIfUserIsSubscriber) {
      return NextResponse.json({ message: "انت بالفعل مسجل في هذا الكورس" }, { status: 400 });
    }
    


    // SEND REQUEST AND
    const sendRequest = await prisma.enrollmentRequest.create({
      data: {
        courseId: parseInt(courseId),
        userId: verfiyToken.id,
      },
    });

    // RETURN SUCCESS MESSAGE
    return NextResponse.json({ message: "تم ارسال طلب الانضمام بنجاح في انتظار موافقة المشرف" }, { status: 200 });

    // WHILE ERROR
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
