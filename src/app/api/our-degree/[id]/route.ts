import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/app/utils/prismaClient";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

interface Props {
  params: {
    id: string;
  };
}

/*
 * Method : DELETE
 * Url : /api/our-degree/${id}
 * Private : private (Only Admin)
 */

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Check The Token If Admin
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken || !verfiyToken.isAdmin) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Check If Id Is Able To Convert To Number
    try {
      if (isNaN(parseInt(params.id))) {
        throw new Error("Invalid ID");
      }
    } catch (error) {
      return NextResponse.json({ message: "ال id غير صالح" }, { status: 400 });
    }

    // Get The Name Of Image By params.id
    const getNameOfImg = await prisma.studentDegree.findUnique({
      where: {
        id: parseInt(params.id),
      },
      select: { imgUrl: true },
    });

    // Check If Image Exists
    if (!getNameOfImg) {
      return NextResponse.json({ message: "لا يوجد صورة بهذا ال Id" }, { status: 404 });
    }

    // Delete The Image From System
    fs.unlink(path.join(UPLOAD_DIR, getNameOfImg.imgUrl), (err) => {
      if (err) {
        console.error("خطأ أثناء حذف الملف:", err);
        return NextResponse.json({ message: "فشل في حذف الملف" }, { status: 500 });
      }
    });

    // Delete The Image From Database
    await prisma.studentDegree.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    // Return Success Message
    return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    console.error("خطأ داخلي في السيرفر:", error);
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
