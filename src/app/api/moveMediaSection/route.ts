//                          TODO
/**
 * ! WARNING
 * ! WARNING
 * ! WARNING
 *
 * THIS ROUTE NOW IF JUST FOR UPDATE THE PLACE OF TEST IF YOU TRY UPDATE THE PLACE OF VIDEO THIS WILL BE AN ERROR BECAUSE THE FOLDER THAT VIDEO IS STORGE IN IT MUST ALSO UPDATE

 * ! WARNING
 * ! WARNING
 * ! WARNING
 */
//                          TODO

import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";

/*
 * Method : PUT
 * Url : /api/moveMediaSection
 * Private : private (Only Admin)
 */

export async function PUT(request: NextRequest) {
  try {
    // Check The Token If Admin
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get Course And Section Id From Url
    const courseId = request.nextUrl.searchParams.get("courseId");
    const sectionId = request.nextUrl.searchParams.get("sectionId");
    const partOfSectionId = request.nextUrl.searchParams.get("partOfSectionId");
    const mediaSectionId = request.nextUrl.searchParams.get("mediaSectionId");

    // Check Ids
    if (!courseId || !sectionId || !partOfSectionId || !mediaSectionId) {
      return NextResponse.json({ message: "البيانات الخاصة بالطلب غير كاملة" }, { status: 400 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(courseId)) || isNaN(parseInt(sectionId)) || isNaN(parseInt(partOfSectionId)) || isNaN(parseInt(mediaSectionId))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال Id الخاص ب الدورة او القسم غير صالح" }, { status: 400 });
    }

    // CHECK IF TEST IS EXIST
    const checkTest = await prisma.groupOfSection.findUnique({
      where: {
        id: parseInt(mediaSectionId),
      },
    });
    if (!checkTest) {
      return NextResponse.json({ message: "لم يتم العثور على الاختبار || الفيديو" }, { status: 404 });
    }

    // CHECK IF COURSE IS EXIST
    const checkCourse = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
    });
    if (!checkCourse) {
      return NextResponse.json({ message: "لم يتم العثور على الدورة" }, { status: 404 });
    }

    // CHECK IF SECTION IS EXIST
    const checkSection = await prisma.section.findUnique({
      where: {
        id: parseInt(sectionId),
      },
    });
    if (!checkSection) {
      return NextResponse.json({ message: "لم يتم العثور على القسم" }, { status: 404 });
    }

    // CHECK PART OF SECTION IS EXIST
    const checkPartOfSection = await prisma.partOfSection.findUnique({
      where: {
        id: parseInt(partOfSectionId),
      },
    });
    if (!checkPartOfSection) {
      return NextResponse.json({ message: "لم يتم العثور على القسم الفرعي" }, { status: 404 });
    }

    // UPDATE THE PLACE OF MEDIA SECTION
    await prisma.groupOfSection.update({
      where: {
        id: parseInt(mediaSectionId),
      },
      data: {
        partOfSection: {
          connect: {
            id: parseInt(partOfSectionId),
          },
          update: {
            Section: {
              connect: {
                id: parseInt(sectionId),
              },
              update: {
                Course: {
                  connect: {
                    id: parseInt(courseId),
                  },
                },
              },
            },
          },
        },
      },
    });

    // Return A Successful Message
    return NextResponse.json({ message: "تم الانشاء بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
