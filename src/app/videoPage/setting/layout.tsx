import { cookies } from "next/headers";
import React from "react";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: any) {
  const token = cookies().get("jwtToken")?.value as string;
  const verfiyToken = tokenInfo() as jwtPayLoad;

  if (verfiyToken.isAdmin == false) {
    redirect(`/noToken?message=${encodeURIComponent("هذه الصفحة مخصصة للمشرفين فقط")}`);
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
