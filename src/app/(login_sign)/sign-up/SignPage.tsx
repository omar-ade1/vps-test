"use client";

import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import "./sign.css";
import { FaEyeSlash, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { BsEye } from "react-icons/bs";
import { FiUserPlus } from "react-icons/fi";
import LogoAuth from "@/app/components/logoAuth/LogoAuth";
import Link from "next/link";
import { z } from "zod";
import { Toast } from "@/app/utils/alert";
import { Inputs_Sign } from "@/app/utils/interfaces/inputsSign";
import { SIGN_UP } from "@/app/fetchApi/auth/sign-up/signUp";
import { useRouter } from "next/navigation";

interface CheckInputs {
  userName?: boolean;
  email?: boolean;
  tel?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  messageUserName: string;
  messageEmail: string;
  messageTel: string;
  messagePassword: string;
  messageConfirmPassword: string;
}

const SignUpPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // To Hide Or Show Password
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);

  const [inputsValues, setInputsValues] = useState<Inputs_Sign>({ userName: "", email: "", tel: "", password: "", confirmPassword: "" });
  const [checkInputs, setCheckInputs] = useState<CheckInputs>({
    userName: false,
    email: false,
    tel: false,
    password: false,
    confirmPassword: false,
    messageUserName: "",
    messageEmail: "",
    messageTel: "",
    messagePassword: "",
    messageConfirmPassword: "",
  });

  const handleSubmitForm = async () => {
    setIsLoading(true);
    // e.preventDefault();

    // Start Schemas For Inputs
    const schemaUserName = z
      .string()
      .min(1, { message: "يجب ادخال قيمة الاسم" })
      .min(2, { message: "لا يمكن ان يقل الاسم عن حرفين" })
      .max(30, { message: "لا يمكن ان يزيد الاسم عن 30 حرف" });

    const schemaEmail = z
      .string()
      .min(1, { message: "يجب ادخال قيمة البريد الالكتروني" })
      .email({ message: "صيغة البريد غير صحيحة" })
      .min(2, { message: "لا يمكن ان يقل البريد الالكتروني عن حرفين" })
      .max(40, { message: "لا يمكن ان يزيد البريد الالكتروني عن 40 حرف" });

    const schemaTel = z
      .string()
      .min(1, { message: "قم بكتابة اسمك" })
      .min(10, { message: "لا يمكن ان يقل الهاتف عن 10 ارقام" })
      .max(10, { message: "لا يمكن ان يزيد الهاتف عن 10 ارقام" })
      .startsWith("05", { message: "يجب ان يبدأ الهاتف ب 05" });

    const schemaPassword = z
      .string()
      .min(1, { message: " يجب ادخال كلمة السر" })
      .min(6, { message: "لا يمكن ان تقل كلمة السر عن 6 احرف" })
      .max(20, { message: "لا يمكن ان تزيد كلمة السر عن 20 حرف" });

    const schemaConfirmPassword = z
      .string()
      .min(1, { message: "يجب ادخال تأكيد كلمة السر" })
      .min(6, { message: "لا يمكن ان تقل كلمة السر عن 6 احرف" })
      .max(20, { message: "لا يمكن ان تزيد كلمة السر عن 20 حرف" });
    // End Schemas For Inputs

    // Start Validation For Shemas Inputs
    const validationUserName = schemaUserName.safeParse(inputsValues.userName);
    const validationEmail = schemaEmail.safeParse(inputsValues.email);
    const validationTel = schemaTel.safeParse(inputsValues.tel);
    const validationPassword = schemaPassword.safeParse(inputsValues.password);
    const validationConfirmPassword = schemaConfirmPassword.safeParse(inputsValues.confirmPassword);

    if (!validationUserName.success) {
      setCheckInputs((prev) => ({ ...prev, userName: true, messageUserName: validationUserName.error.errors[0].message }));
    } else {
      setCheckInputs((prev) => ({ ...prev, userName: false, messageUserName: "" }));
    }

    if (!validationEmail.success) {
      setCheckInputs((prev) => ({ ...prev, email: true, messageEmail: validationEmail.error.errors[0].message }));
    } else {
      setCheckInputs((prev) => ({ ...prev, email: false, messageEmail: "" }));
    }

    if (!validationTel.success) {
      setCheckInputs((prev) => ({ ...prev, tel: true, messageTel: validationTel.error.errors[0].message }));
    } else {
      setCheckInputs((prev) => ({ ...prev, tel: false, messageTel: "" }));
    }

    if (!validationPassword.success) {
      setCheckInputs((prev) => ({ ...prev, password: true, messagePassword: validationPassword.error.errors[0].message }));
    } else {
      setCheckInputs((prev) => ({ ...prev, password: false, messagePassword: "" }));
    }

    if (!validationConfirmPassword.success) {
      setCheckInputs((prev) => ({ ...prev, confirmPassword: true, messageConfirmPassword: validationConfirmPassword.error.errors[0].message }));
    } else {
      setCheckInputs((prev) => ({ ...prev, confirmPassword: false, messageConfirmPassword: "" }));
    }
    // End Validation For Shemas Inputs

    // If Schemas Of Password And Confirm Password Is Successed
    if (validationPassword.success && validationConfirmPassword.success) {
      // Check If Password = Confirm Password
      if (inputsValues.confirmPassword !== inputsValues.password) {
        setCheckInputs((prev) => ({
          ...prev,
          password: true,
          confirmPassword: true,
          messagePassword: "كلمة السر غير متطابقة",
          messageConfirmPassword: "كلمة السر غير متطابقة",
        }));
        setIsLoading(false);

        return Toast.fire({
          icon: "error",
          title: "كلمة السر غير متطابقة",
        });
      } else {
        setCheckInputs((prev) => ({
          ...prev,
          password: false,
          confirmPassword: false,
          messagePassword: "",
          messageConfirmPassword: "",
        }));
      }
    }

    console.log(true);

    // If All Of Schemas Are Successed
    if (
      validationUserName.success &&
      validationEmail.success &&
      validationTel.success &&
      validationPassword.success &&
      validationConfirmPassword.success
    ) {
      // Sign Up Method
      const message: any = await SIGN_UP(inputsValues);

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
    <main className="background-sign-page min-h-[calc(100vh-64px)] flex items-center justify-center flex-col">
      <div className="py-10 text-center rounded-xl my-10 px-2">
        <h2 className="text-4xl font-extrabold text-orange-600 flex justify-center items-center gap-3 xxsm:text-3xl">
          طلب انشاء حساب <FiUserPlus className="" />
        </h2>
        <h3 className="text-xl">قم بإدخال البيانات بشكل صحيح و سيتم إرسال طلب إنضمام للمشرف</h3>
      </div>
      <div className="container flex justify-around items-center gap-10 xmdT0:flex-col relative z-10">
        <section className="max-w-full xmdT0:w-full">
          <div className="grid gap-3 w-[400px] xmdT0:w-full max-w-full">
            {/* User Name */}
            <Input
              isInvalid={checkInputs.userName}
              description={checkInputs.userName && checkInputs.messageUserName}
              isRequired
              color="primary"
              variant="flat"
              classNames={{
                label: " font-bold top-[28px]",
                inputWrapper:
                  "min-h-[80px] border-transparent border-2 hover:border-black focus-within:!bg-[#b0d7ff] focus-within:!text-black focus-within:border-black",
                input: "font-bold text-black",
                description: "text-sm font-bold text-red-600",
              }}
              className="block"
              type="text"
              size="lg"
              label="ادخل اسمك ثلاثي"
              startContent={
                <div className="ml-2 pt-2 mt-2">
                  <FaUserAlt className="text-2xl pointer-events-none flex-shrink-0" />
                </div>
              }
              onChange={(e) => setInputsValues((prev) => ({ ...prev, userName: e.target.value }))}
            />

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

            {/* Telephone */}
            <Input
              isInvalid={checkInputs.tel}
              description={checkInputs.tel && checkInputs.messageTel}
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
              className="block after:hidden before:hidden"
              type="number"
              size="lg"
              label="رقم الهاتف"
              startContent={
                <div className="ml-2 pt-2 mt-2">
                  <FaPhone className="text-2xl pointer-events-none flex-shrink-0" />
                </div>
              }
              onChange={(e) => setInputsValues((prev) => ({ ...prev, tel: e.target.value }))}
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

            {/* Password Again */}
            <Input
              isInvalid={checkInputs.confirmPassword}
              description={checkInputs.confirmPassword && checkInputs.messageConfirmPassword}
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
              label="اعد كتابة كلمة السر"
              startContent={
                <div className="ml-2 pt-2 mt-2">
                  <FaKey className="text-2xl pointer-events-none flex-shrink-0" />
                </div>
              }
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility2} aria-label="toggle password visibility">
                  {isVisible2 ? <BsEye className="text-2xl pointer-events-none" /> : <FaEyeSlash className="text-2xl pointer-events-none" />}
                </button>
              }
              onChange={(e) => setInputsValues((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              type={isVisible2 ? "text" : "password"}
            />
            {/* Button Submit */}
            <Button
              isLoading={isLoading}
              className="flex justify-center items-center text-xl h-fit p-5 font-bold"
              type="submit"
              color="primary"
              size="lg"
              onClick={handleSubmitForm}
            >
              إنشاء حساب
            </Button>
          </div>
          <p className="text-xl  my-3 p-2 rounded-xl bg-white">
            لديك حساب بالفعل؟{" "}
            <Link className="font-extrabold underline" href={"/login"}>
              الدخول الي حسابك
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

export default SignUpPage;
