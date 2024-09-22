import { Inputs_Sign, Inputs_Sign_Api } from "@/app/utils/interfaces/inputsSign";
import { prisma } from "@/app/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

import argon2 from "argon2";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { generateCookie } from "@/app/utils/generateCookie";
import { z } from "zod";

/*
 * Method : Post
 * Url : /api/sign-up
 * Private : public
 */
export async function POST(request: NextRequest) {
  try {
    const body: Inputs_Sign_Api = await request.json();

    // Checking The Inputs
    const bodyShema = z.object({
      userName: z
        .string({ required_error: "يجب ادخال قيمة الاسم" })
        .min(1, { message: "يجب ادخال قيمة الاسم" })
        .min(2, { message: "لا يمكن ان يقل الاسم عن حرفين" })
        .max(30, { message: "لا يمكن ان يزيد الاسم عن 30 حرف" }),

      email: z
        .string({ required_error: "يجب ادخال قيمة البريد الالكتروني" })
        .min(1, { message: "يجب ادخال قيمة البريد الالكتروني" })
        .email({ message: "صيغة البريد غير صحيحة" })
        .min(2, { message: "لا يمكن ان يقل البريد الالكتروني عن حرفين" })
        .max(40, { message: "لا يمكن ان يزيد البريد الالكتروني عن 40 حرف" }),
      tel: z
        .string({ required_error: "قم بكتابة رقم الهاتف" })
        .min(1, { message: "قم بكتابة رقم الهاتف" })
        .min(10, { message: "لا يمكن ان يقل الهاتف عن 10 ارقام" })
        .max(10, { message: "لا يمكن ان يزيد الهاتف عن 10 ارقام" })
        .startsWith("05", { message: "يجب ان يبدأ الهاتف ب 05" }),
      password: z
        .string({ required_error: "يجب ادخال كلمة السر" })
        .min(1, { message: " يجب ادخال كلمة السر" })
        .min(6, { message: "لا يمكن ان تقل كلمة السر عن 6 احرف" })
        .max(20, { message: "لا يمكن ان تزيد كلمة السر عن 20 حرف" }),
    });
    const validation = bodyShema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message });
    }

    // Check If This Email Is Exists Or Not
    const checkIfUser = await prisma.user.findUnique({ where: { email: body.email } });
    if (checkIfUser) {
      return NextResponse.json({ message: "البريد الالكتروني غير صالح" }, { status: 400 });
    }

    // Hash The Password
    const Passwordhash = await argon2.hash(body.password);

    // Create Account
    const newUser = await prisma.user.create({
      data: {
        userName: body.userName,
        email: body.email,
        password: Passwordhash,
        tel: body.tel,
      },
    });

    // This For Jwt Payload For Generate Token
    const jwtPayLoad: jwtPayLoad = {
      email: newUser.email,
      userName: newUser.userName,
      tel: newUser.tel,
      isAdmin: newUser.isAdmin,
      isConfirm: newUser.isConfirm,
      id: newUser.id,
    };

    // Generate Token And Cookie
    const cookie = generateCookie(jwtPayLoad) as string;

    if (!cookie) {
      return NextResponse.json({ message: "مفتاح التوقيع السري غير معرف" }, { status: 500 });
    }

    return NextResponse.json({ message: "تم إنشاء حساب بنجاح" }, { status: 200, headers: { "Set-Cookie": cookie } });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
