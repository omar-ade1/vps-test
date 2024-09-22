// src/app/api/tokenVerify/route.ts
import { cookies } from "next/headers";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = cookies().get("jwtToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "لم يتم العثور على ال Token" }, { status: 404 });
    }

    const verfiyToken = tokenInfo();

    return NextResponse.json({ message: verfiyToken }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "خطأ داخلي في السيرفر" }, { status: 500 });
  }
}
