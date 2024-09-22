import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
/*
 * Method : POST
 * Url : /api/resultOfExam
 * Private : private (If User Is Admin)
 */

export async function POST(request: NextRequest) {
  try {
    // Check Token IS ADMIN
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || verfiyToken.isAdmin == false) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // GET IDS FROM PARAMS
    const courseId = request.nextUrl.searchParams.get("courseId") as string;
    const sectionId = request.nextUrl.searchParams.get("sectionId") as string;
    const partOfSectionId = request.nextUrl.searchParams.get("partOfSectionId") as string;
    const mediaSectionId = request.nextUrl.searchParams.get("mediaSectionId") as string;
    const videoId = request.nextUrl.searchParams.get("videoId") as string;

    // CHECK IF IDS
    if (!courseId || !sectionId || !partOfSectionId || !mediaSectionId || !videoId) {
      return NextResponse.json({ message: "معلومات الطلب غير مكتملة : لم يتم العثور على معرف الكورس او القسم" }, { status: 404 });
    }

    // FIND COURSE, SECTION, PART OF SECTION, MEDIA SECTION
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
    });
    if (!course) {
      return NextResponse.json({ message: "لم يتم العثور على كورس بهذا ال ID" }, { status: 404 });
    }

    const section = await prisma.section.findUnique({
      where: {
        id: parseInt(sectionId),
      },
    });
    if (!section) {
      return NextResponse.json({ message: "لم يتم العثور على قسم بهذا ال ID" }, { status: 404 });
    }

    const partOfSection = await prisma.partOfSection.findUnique({
      where: {
        id: parseInt(partOfSectionId),
      },
    });
    if (!partOfSection) {
      return NextResponse.json({ message: "لم يتم العثور على قسم بهذا ال ID" }, { status: 404 });
    }

    const mediaSection = await prisma.groupOfSection.findUnique({
      where: {
        id: parseInt(mediaSectionId),
      },
    });
    if (!mediaSection) {
      return NextResponse.json({ message: "لم يتم العثور على قسم بهذا ال ID" }, { status: 404 });
    }

    // UPLOAD DIR OF VIDEO WITH A PARTS NAME

    //
    const MAIN_UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", `public/video`);

    // WITH COURSE NAME
    const UPLOAD_DIR_COURSE_NAME = path.resolve(process.env.ROOT_PATH ?? "", `public/video/${course.courseName}`);

    // WITH SECTION NAME
    const UPLOAD_DIR_SECTION_NAME = path.resolve(process.env.ROOT_PATH ?? "", `public/video/${course.courseName}/${section.title}`);

    // WITH PART OF SECTION NAME
    const UPLOAD_DIR_PART_OF_SECTION_NAME = path.resolve(
      process.env.ROOT_PATH ?? "",
      `public/video/${course.courseName}/${section.title}/${partOfSection.title}`
    );

    // WITH MEDIA SECTION NAME
    const UPLOAD_DIR_MEDIA_SECTION_NAME = path.resolve(
      process.env.ROOT_PATH ?? "",
      `public/video/${course.courseName}/${section.title}/${partOfSection.title}/${mediaSection.title}`
    );

    // Get The Data From Input In The Front End
    const formData = await request.formData();

    // Convert The Form Data To Javascript Object
    const body = Object.fromEntries(formData);

    const file = (body.file as Blob) || null;

    // Check If File Is Founded
    if (!(body?.file as File)?.name) {
      return NextResponse.json({ message: "برجاء تحميل فيديو" }, { status: 400 });
    }

    // Check If Any Course In Data Base Have The Same Name With The Img That User Want To Upload It
    const checkTheVideo = await prisma.video.findUnique({
      where: {
        videoUrl: `${course.courseName}/${section.title}/${partOfSection.title}/${mediaSection.title}/${(body.file as File).name}`,
      },
    });

    // If Video Exist In Data Base Then Return Error Message
    if (checkTheVideo) {
      return NextResponse.json(
        { message: "هناك فيديو بنفس اسم هذا الفيديو الذي تريد تحميله , لا يمكن تحميل فيديوهات متعددة بنفس الاسم" },
        { status: 400 }
      );
    }

    // IF NO UPLOAD FILE PATH CREATE IT
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // if no upload file create it
      if (!fs.existsSync(MAIN_UPLOAD_DIR)) {
        fs.mkdirSync(MAIN_UPLOAD_DIR);
      }
      if (!fs.existsSync(UPLOAD_DIR_COURSE_NAME)) {
        fs.mkdirSync(UPLOAD_DIR_COURSE_NAME);
      }
      if (!fs.existsSync(UPLOAD_DIR_SECTION_NAME)) {
        fs.mkdirSync(UPLOAD_DIR_SECTION_NAME);
      }
      if (!fs.existsSync(UPLOAD_DIR_PART_OF_SECTION_NAME)) {
        fs.mkdirSync(UPLOAD_DIR_PART_OF_SECTION_NAME);
      }
      if (!fs.existsSync(UPLOAD_DIR_MEDIA_SECTION_NAME)) {
        fs.mkdirSync(UPLOAD_DIR_MEDIA_SECTION_NAME);
      }

      // write the file that was uploaded by input
      fs.writeFileSync(path.resolve(UPLOAD_DIR_MEDIA_SECTION_NAME, (body.file as File).name), buffer);

      // while filed
    } else {
      return NextResponse.json({ message: "حدث خطأ اثناء تحميل الفيديو" }, { status: 400 });
    }

    // UPDATE THE VIDEO DATA IN DB
    await prisma.video.update({
      where: {
        id: parseInt(videoId),
      },
      data: {
        videoUrl: `${course.courseName}/${section.title}/${partOfSection.title}/${mediaSection.title}/${(body.file as File).name}`,
        videoName: (body.file as File).name,
        courseName: course.courseName,
        mediaSectionName: mediaSection.title,
        partOfSectionName: partOfSection.title,
        sectionName: section.title,
      },
    });

    // RETURN SUCCESS RESPONSE
    return NextResponse.json({ message: "تم تحميل الفيديو بنجاح" }, { status: 200 });

    // WHILL ERROR
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
