"use client";

import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import "./login.css";
import { FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa6";
import { BsEye } from "react-icons/bs";
import { IoIosLogIn } from "react-icons/io";
import LogoAuth from "@/app/components/logoAuth/LogoAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Toast } from "@/app/utils/alert";
import { Login_USER } from "@/app/fetchApi/auth/login/login";

interface CheckInputs {
  email?: boolean;
  password?: boolean;
  messageEmail: string;
  messagePassword: string;
}

interface InputsValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [inputsValues, setInputsValues] = useState<InputsValues>({ email: "", password: "" });

  const [checkInputs, setCheckInputs] = useState<CheckInputs>({
    email: false,
    password: false,
    messageEmail: "",
    messagePassword: "",
  });
  // e: React.FormEvent<HTMLFormElement>
  const handelLogin = async () => {
    // e.preventDefault();
    setIsLoading(true);

    // Start Schemas For Inputs
    const schemaEmail = z
      .string()
      .min(1, { message: "يجب ادخال قيمة البريد الالكتروني" })
      .email({ message: "صيغة البريد غير صحيحة" })
      .min(2, { message: "لا يمكن ان يقل البريد الالكتروني عن حرفين" })
      .max(40, { message: "لا يمكن ان يزيد البريد الالكتروني عن 40 حرف" });

    const schemaPassword = z
      .string()
      .min(1, { message: " يجب ادخال كلمة السر" })
      .min(6, { message: "لا يمكن ان تقل كلمة السر عن 6 احرف" })
      .max(20, { message: "لا يمكن ان تزيد كلمة السر عن 20 حرف" });
    // End Schemas For Inputs

    // Start Validation For Shemas Inputs
    const validationEmail = schemaEmail.safeParse(inputsValues.email);
    const validationPassword = schemaPassword.safeParse(inputsValues.password);

    if (!validationEmail.success) {
      setCheckInputs((prev) => ({ ...prev, email: true, messageEmail: validationEmail.error.errors[0].message }));
    } else {
      setCheckInputs((prev) => ({ ...prev, email: false, messageEmail: "" }));
    }

    if (!validationPassword.success) {
      setCheckInputs((prev) => ({ ...prev, password: true, messagePassword: validationPassword.error.errors[0].message }));
    } else {
      setCheckInputs((prev) => ({ ...prev, password: false, messagePassword: "" }));
    }
    // End Validation For Shemas Inputs

    // If All Of Schemas Are Successed
    if (validationEmail.success && validationPassword.success) {
      // Sign Up Method
      const message: any = await Login_USER(inputsValues);

      // While Successed
      if (message.request.status == 200) {
        setIsLoading(false);
        router.replace("/");
        return Toast.fire({
          icon: "success",
          title: message.data.message,
        });

        // While Error
      } else {
        setIsLoading(false);
        return Toast.fire({
          icon: "error",
          title: message.response.data.message,
        });
      }
    } else {
      setIsLoading(false);
      return Toast.fire({
        icon: "error",
        title: "خطأ في البيانات المدخلة",
      });
    }
  };

  return (
    <main className="background-login-page min-h-[calc(100vh-64px)] flex items-center justify-center flex-col">
      <div className="py-10 text-center rounded-xl my-10 px-2">
        <h2 className="text-4xl font-extrabold text-orange-600 flex justify-center items-center gap-3">
          تسجيل دخول <IoIosLogIn />
        </h2>
        <h3 className="text-xl">قم بتسجيل الدخول لحسابك</h3>
      </div>

      <div className="container flex justify-around items-center gap-10 xmdT0:flex-col relative z-10">
        <section className="max-w-full xmdT0:w-full">
          <div className="grid  gap-2 w-[400px] xmdT0:w-full max-w-full">
            {/* Email */}
            <Input
              isInvalid={checkInputs.email}
              description={checkInputs.email && checkInputs.messageEmail}
              isRequired
              color="primary"
              variant="flat"
              classNames={{
                label: " font-bold top-[28px]",
                inputWrapper:
                  "h-[80px] border-transparent border-2 hover:border-black focus-within:!bg-[#b0d7ff] focus-within:!text-black focus-within:border-black",
                input: "font-bold text-black",
                description: "text-sm font-bold text-red-600",
              }}
              className="block"
              size="lg"
              label="البريد الإلكتروني"
              startContent={
                <div className="ml-2 pt-2 mt-2">
                  <MdEmail className="text-2xl pointer-events-none flex-shrink-0" />
                </div>
              }
              onChange={(e) => setInputsValues((prev) => ({ ...prev, email: e.target.value }))}
            />

            {/* Password */}
            <Input
              isInvalid={checkInputs.password}
              description={checkInputs.password && checkInputs.messagePassword}
              isRequired
              color="primary"
              variant="flat"
              classNames={{
                label: " font-bold top-[28px]",
                inputWrapper:
                  "h-[80px] border-transparent border-2 hover:border-black focus-within:!bg-[#b0d7ff] focus-within:!text-black focus-within:border-black",
                input: "font-bold text-black",
                description: "text-sm font-bold text-red-600",
              }}
              className="block"
              size="lg"
              label="كلمة السر"
              startContent={
                <div className="ml-2 pt-2 mt-2">
                  <FaKey className="text-2xl pointer-events-none flex-shrink-0" />
                </div>
              }
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                  {isVisible ? <BsEye className="text-2xl pointer-events-none" /> : <FaEyeSlash className="text-2xl pointer-events-none" />}
                </button>
              }
              onChange={(e) => setInputsValues((prev) => ({ ...prev, password: e.target.value }))}
              type={isVisible ? "text" : "password"}
            />

            {/* Button Submit */}
            <Button
              isLoading={isLoading}
              className="flex justify-center items-center text-xl h-fit p-5 font-bold"
              type="submit"
              color="primary"
              size="lg"
              onClick={handelLogin}
            >
              تسجيل
            </Button>
          </div>
          <p className="text-xl  my-3 p-2 rounded-xl shadow-xl bg-white">
            ليس لديك حساب ؟{" "}
            <Link className="font-extrabold underline" href={"/sign-up"}>
              إنشاء حساب جديد
            </Link>
          </p>
        </section>

        <section className="relative z-10">
          <LogoAuth />
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
