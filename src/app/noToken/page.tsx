import { cookies } from "next/headers";
import React from "react";
import { tokenInfo } from "../utils/tokenVerify";
import { jwtPayLoad } from "../utils/interfaces/jwtPayload";
import { redirect } from "next/navigation";
import NoToken from "./components/NoToken";

const ContainerToken = () => {
  const token = cookies().get("jwtToken")?.value as string;
  const verfiyToken = tokenInfo() as jwtPayLoad;

  // if (!token) {
  //   // redirect("/noToken?message=هذا الطلب مرفوض يجب تسجيل الدخول لتصفح الدورة");
  // }
  return (
    <main className="min-h-[calc(100vh-64px)] pt-[50px] pb-[100px] relative">
      <div className="container">
        <NoToken />
      </div>
    </main>
  );
};

export default ContainerToken;
