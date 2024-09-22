import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { z } from "zod";

/*
 * Method : GET
 * Url : /api/our-course
 * Private : public
 */
export async function GET(request: NextRequest) {
  try {
    // GET ALL OF COURSES
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

/*
 * Method : POST
 * Url : /api/our-course
 * Private : private (Only Admin)
 */

interface Body {
  courseName: string;
  courseSubName: string;
  courseImg: any;
}

// the dir of the project
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/our-courses");

export async function POST(request: NextRequest) {
  try {
    // Verify Token And Check Is Admin
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Parse the form data
    const formData = await request.formData();

    // GET THE COURSE NAME AND COURSE SUBNAME FROM THE FORM DATA
    const courseName = formData.get("courseName") as string;
    const courseSubName = formData.get("courseSubName") as string;

    // SCHEMA FOR INPUTS
    const nameSchema = z.string({ message: "لا يمكن ترك اسم الدورة فارغ" }).min(1, { message: "لا يمكن ترك اسم الدورة فارغ" }).min(2).max(40);
    const subNameSchema = z
      .string({ message: "لا يمكن ترك الاسم الفرعي الدورة فارغ" })
      .min(1, { message: "لا يمكن ترك الاسم الفرعي الدورة فارغ" })
      .min(2)
      .max(40);

    // CHECK THE SCHEMA
    const validaitionName = nameSchema.safeParse(courseName);
    const validaitionSubName = subNameSchema.safeParse(courseSubName);

    // Check If The Course Name And Course SubName Are Valid
    if (!validaitionName.success) {
      return NextResponse.json({ message: validaitionName.error?.errors[0].message }, { status: 400 });
    }
    if (!validaitionSubName.success) {
      return NextResponse.json({ message: validaitionSubName.error?.errors[0].message }, { status: 400 });
    }

    // Check If The Course Name IS Already Exist In The Data Base
    const checkCourse = await prisma.course.findUnique({
      where: {
        courseName: courseName,
      },
    });

    // If The Course Name Is Already Exist In The Data Base Return Error Message
    if (checkCourse) {
      return NextResponse.json({ message: "هناك دورة اخرى بنفس الاسم لا يمكن ان يكون هناك اكثر من دورة بنفس الاسم" }, { status: 400 });
    }

    // Convert The Form DPata To Javascript Object
    const bodyFormData = Object.fromEntries(formData);
    const file = (bodyFormData.file as Blob) || null;

    // Check If File Is Founded
    if (!(bodyFormData?.file as File)?.name) {
      return NextResponse.json({ message: "برجاء تحميل صورة" }, { status: 400 });
    }

    // Check If Any Course In Data Base Have The Same Name With The Img That User Want To Upload It
    const checkTheImg = await prisma.course.findUnique({
      where: {
        courseImg: (bodyFormData.file as File).name,
      },
    });
    // If The Course IMG Is Already Exist In The Data Base Return Error Message
    if (checkTheImg) {
      return NextResponse.json({ message: "هناك صورة بنفس اسم هذه الصورة التي تريد تحميلها , لا يمكن تحميل صور متعددة بنفس الاسم" }, { status: 400 });
    }

    // Check If File
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // If No Upload File Create It
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      // Write The File That Was Uploaded By Input
      fs.writeFileSync(path.resolve(UPLOAD_DIR, (bodyFormData.file as File).name), buffer);

      // While Filed
    } else {
      return NextResponse.json({ message: "حدثت مشكلة اثناء تحميل الصورة" }, { status: 400 });
    }

    // Create The Course In The Data Base
    await prisma.course.create({
      data: {
        courseName: courseName,
        courseSubName: courseSubName,
        courseImg: (bodyFormData.file as File).name,
      },
    });

    // Return Success Message With Status Code 200

    return NextResponse.json({ message: "تم الانشاء بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
