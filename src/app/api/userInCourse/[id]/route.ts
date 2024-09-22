import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { Params } from "@/app/utils/interfaces/Params";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    const subscriberId = params.id;
    const courseId = request.nextUrl.searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json({ message: "يجب تحديد الدورة" }, { status: 400 });
    }

    if (!subscriberId) {
      return NextResponse.json({ message: "يجب تحديد المشترك" }, { status: 400 });
    }

    // Check If Ids Is Able To Convert To Number
    try {
      if (isNaN(parseInt(subscriberId)) || isNaN(parseInt(courseId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    const checkSubscriber = await prisma.user.findUnique({
      where: {
        id: parseInt(subscriberId),
        enrollments: {
          some: {
            id: parseInt(courseId),
          },
        },
      },
    });

    if (!checkSubscriber) {
      return NextResponse.json({ message: "المشترك غير موجود" }, { status: 404 });
    }

    const deleteSubscriber = await prisma.user.update({
      where: {
        id: parseInt(subscriberId),
      },
      data: {
        enrollments: {
          disconnect: {
            id: parseInt(courseId),
          },
        },
      },
    });

    return NextResponse.json({ message: "تم حذف المشترك بنجاح" }, { status: 200 });

    // WHILL ERROR
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
