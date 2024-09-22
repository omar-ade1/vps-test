"use client";

import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { ADD_NEW_QUESTION_BANK } from "@/app/fetchApi/questionBank/addNewQuestionBank";
import { Toast } from "@/app/utils/alert";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";

const AddNewQuestionBank = () => {
  const [nameOfBank, setNameOfBank] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const addQuestionBank = async () => {
    setIsLoading(true);
    const message: any = await ADD_NEW_QUESTION_BANK(nameOfBank);
    if (message.request.status === 200) {
      Toast.fire({
        title: message.data.message,
        icon: "success",
      });
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  return (
    <main className="min-h-[calc(100vh-100px)] py-[50px]">
      <TitleForPage titleText="اضافة بنك اسئلة جديد" />
      <div className="container flex justify-center items-center flex-col gap-5">
        <Input
          onChange={(e) => {
            setNameOfBank(e.target.value.trim());
          }}
          className="block w-[400px] max-w-full"
          classNames={{
            label: "text-lg font-bold",
            inputWrapper: "bg-gray-200",
            input: "text-xl font-bold",
          }}
          label="اسم بنك الأسئلة"
          size="lg"
          variant="faded"
          color="primary"
        />
        <Button
          isLoading={isLoading}
          onClick={() => {
            addQuestionBank();
          }}
          color="success"
          className="p-5 w-[400px] max-w-full flex justify-center items-center text-xl font-bold h-fit"
        >
          اضافة
        </Button>
      </div>
    </main>
  );
};

export default AddNewQuestionBank;
