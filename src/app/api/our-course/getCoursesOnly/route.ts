import { prisma } from "@/app/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";


/*
 * Method : GET
 * Url : /api/getCoursesOnly
 * Private : public
 */
export async function GET(request: NextRequest) {
  try {
    // GET ALL COURSES
    const courses = await prisma.course.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        EnrollmentRequest: {
          include: {
            user: {
              select: {
                id: true,
                tel: true,
                userName: true,
              },
            },
          },
        },
        enrolledUsers: {
          select: {
            id: true,
            tel: true,
            userName: true,
          },
        },
      },
    });
    // RETURN ALL COURSES WITH STATUS CODE 200
    return NextResponse.json({ message: courses }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
