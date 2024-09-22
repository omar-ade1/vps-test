"use client";
import { Button, Divider } from "@nextui-org/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";
import noTokenImg from "../../../../public/noTokenImg.svg";
import Link from "next/link";

const NoToken = () => {
  const message = useSearchParams().get("message");

  return (
    <div>
      <div>
        <Image className="block w-[500px] max-w-full mx-auto" src={noTokenImg} alt="no token" />
      </div>

      <div className="p-2 shadow-xl border w-[1000px] max-w-full mx-auto">
        <h2 className="text-2xl font-bold text-red-600 mx-auto text-center">{message}</h2>
      </div>

      <div className="p-2 shadow-xl border mt-3 w-[1000px] max-w-full mx-auto">
        <div className="flex gap-5 my-3 justify-center items-center">
          <h3 className="text-xl font-bold my-2">هل تمتلك حساب ؟</h3>
          <Button as={Link} href="/login" size="lg" className="font-bold h-fit p-3 underline" variant="light" color="primary">
            تسجيل دخول
          </Button>
        </div>

        <Divider />
        
        <div className="flex gap-5 my-3 justify-center items-center">
          <h3 className="text-xl font-bold my-2">مستخدم جديد</h3>

          <Button as={Link} href="/sign-up" size="lg" className="font-bold h-fit p-3 underline" variant="light" color="primary">
            إنشاء حساب
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoToken;
