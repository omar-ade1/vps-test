import { prisma } from "@/app/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as argon2 from "argon2";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { generateCookie } from "@/app/utils/generateCookie";

/*
 * Method : Post
 * Url : /api/login
 * Private : public
 */
export async function POST(request: NextRequest) {
  try {
    interface Body {
      email: string;
      password: string;
    }
    const body: Body = await request.json();

    // Schema For Inputs
    const bodySchema = z.object({
      email: z
        .string({ required_error: "يجب ادخال قيمة البريد الالكتروني" })
        .min(1, { message: "يجب ادخال قيمة البريد الالكتروني" })
        .email({ message: "صيغة البريد غير صحيحة" })
        .min(2, { message: "لا يمكن ان يقل البريد الالكتروني عن حرفين" })
        .max(40, { message: "لا يمكن ان يزيد البريد الالكتروني عن 40 حرف" }),
      password: z
        .string({ required_error: "يجب ادخال كلمة السر" })
        .min(1, { message: " يجب ادخال كلمة السر" })
        .min(6, { message: "لا يمكن ان تقل كلمة السر عن 6 احرف" })
        .max(20, { message: "لا يمكن ان تزيد كلمة السر عن 20 حرف" }),
    });

    // Checking
    const vaildation = bodySchema.safeParse(body);
    if (!vaildation.success) {
      return NextResponse.json({ message: vaildation.error.errors[0].message }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user) {
      return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 400 });
    }

    const isPasswordValid = await argon2.verify(user.password, body.password);

    if (isPasswordValid) {
      // This For Jwt Payload For Generate Token
      const jwtPayLoad: jwtPayLoad = {
        email: user.email,
        userName: user.userName,
        tel: user.tel,
        isAdmin: user.isAdmin,
        isConfirm: user.isConfirm,
        id : user.id
      };

      // Generate Token And Cookie
      const cookie = generateCookie(jwtPayLoad) as string;

      if (!cookie) {
        return NextResponse.json({ message: "مفتاح التوقيع السري غير معرف" }, { status: 500 });
      }

      return NextResponse.json({ message: "تم تسجيل الدخول بنجاح" }, { status: 200, headers: { "Set-Cookie": cookie } });
    } else {
      return NextResponse.json({ message: "خطأ في كلمة السر أو البريد الإلكتروني" }, { status: 400 });
    }

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
