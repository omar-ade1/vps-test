import { NextRequest, NextResponse } from "next/server";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { prisma } from "@/app/utils/prismaClient";
import { Params } from "@/app/utils/interfaces/Params";
/*
 * Method : GET
 * Url : /api/video/${id}
 * Private : private (If User Is Subscribe In The Course)
 */

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Check The Token
    const verfiyToken = tokenInfo() as jwtPayLoad;
    if (!verfiyToken) {
      return NextResponse.json({ message: "تم رفض الطلب : غير مصرح لك بتنفيذ هذا الطلب" }, { status: 403 });
    }

    // Video Id From Params
    const videoId = params.id;

    // Check The Video Id
    if (!videoId) {
      return NextResponse.json({ message: "معلومات الطلب غير مكتملة : لم يتم العثور على معرف الفيديو" }, { status: 404 });
    }

    // Get The Video From DataBase By Id
    const video = await prisma.video.findUnique({
      where: {
        id: parseInt(videoId),
      },
    });

    // Check The Video
    if (!video) {
      return NextResponse.json({ message: "لم يتم العثور على فيديو بهذا ال ID" }, { status: 404 });
    }

    // Return The Video
    return NextResponse.json({ message: video }, { status: 200 });
    
    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
