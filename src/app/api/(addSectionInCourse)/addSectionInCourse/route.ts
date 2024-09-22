/**
 * THIS FILL INCLUDE ONE FUNCTION (POST)
 * POST FUNCTION FOR CREATE A NEW SECTION IN DATABASE
 * ONLY ADMIN CAN CREATE A NEW SECTION
 */

import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/*
 * Method : POST
 * Url : /api/addSectionInCourse
 * Private : private (Only Admin)
 */

interface Body {
  title: string;
  details: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check The Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get Id Of Course From Url
    const idOfCourse = request.nextUrl.searchParams.get("courseId");

    // Check The Id Of Course
    if (!idOfCourse) {
      return NextResponse.json({ message: "لم يتم العثور على ID الخاص بالدورة" }, { status: 404 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(idOfCourse))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "لا يوجد دورة بهذا ال Id" }, { status: 404 });
    }

    // Get The Course By Id
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(idOfCourse),
      },
    });

    // Check The Course By Id
    if (!course) {
      return NextResponse.json({ message: "لا توجد دورة بهذا ال ID" }, { status: 404 });
    }

    // Inputs Of User
    const body: Body = await request.json();

    // Body Schema
    const bodySchema = z.object({
      title: z.string(),
      details: z.string().optional(),
    });

    // Check The Body Schema
    const validaition = bodySchema.safeParse(body);
    if (!validaition.success) {
      return NextResponse.json({ message: validaition.error.errors[0].message }, { status: 400 });
    }

    // Create A New Section
    await prisma.section.create({
      data: {
        title: body.title,
        details: body.details,
        courseId: parseInt(idOfCourse),
      },
    });

    // Return A Successful Message
    return NextResponse.json({ message: "تم الانشاء بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
