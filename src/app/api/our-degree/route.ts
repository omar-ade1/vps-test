import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { prisma } from "@/app/utils/prismaClient";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";

/*
 * Method : GET
 * Url : /api/our-degree
 * Private : public
 */
export async function GET(request: NextRequest) {
  try {
    // GET ALL STUDENTS DEGREE
    const imgsUrl = await prisma.studentDegree.findMany();
    return NextResponse.json({ message: imgsUrl }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}

// the dir of the project
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

/*
 * Method : POST
 * Url : /api/our-degree
 * Private : private (Only Admin)
 */
export async function POST(request: NextRequest) {
  try {
    // CHECK THE TOKEN IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Get The Data From Input In The Front End
    const formData = await request.formData();

    // Convert The Form Data To Javascript Object
    const body = Object.fromEntries(formData);

    const file = (body.file as Blob) || null;

    // Check If File Is Founded
    if (!(body?.file as File)?.name) {
      return NextResponse.json({ message: "برجاء تحميل صورة" }, { status: 400 });
    }

    // Check If Any Course In Data Base Have The Same Name With The Img That User Want To Upload It
    const checkTheImg = await prisma.studentDegree.findUnique({
      where: {
        imgUrl: (body.file as File).name,
      },
    });

    // If There Is Same Name In Data Base Return Error Message
    if (checkTheImg) {
      return NextResponse.json({ message: "هناك صورة بنفس اسم هذه الصورة التي تريد تحميلها , لا يمكن تحميل صور متعددة بنفس الاسم" }, { status: 400 });
    }

    // Check If File
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // if no upload file create it
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      // write the file that was uploaded by input
      fs.writeFileSync(path.resolve(UPLOAD_DIR, (body.file as File).name), buffer);

      // while filed
    } else {
      return NextResponse.json({ message: "حدث خطأ اثناء تحميل الصورة" }, { status: 400 });
    }

    // CREATE A NEW STUDENT DEGREE IN DATABASE
    await prisma.studentDegree.create({
      data: {
        imgUrl: (body.file as File).name,
      },
    });

    // Return Success Message
    return NextResponse.json({ message: "تم تحميل الصورة بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
