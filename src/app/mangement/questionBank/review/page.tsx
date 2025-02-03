"use client";

import Empty from "@/app/components/empty/Empty";
import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { GET_QUESTION_BANK } from "@/app/fetchApi/questionBank/getAllQuestionBank";
import { Toast } from "@/app/utils/alert";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface QuestionBankData {
  id: number;
  name: string;
}

const ReviewQuestionBank = () => {
  // state for question Bank data
  const [questionBankData, setQuestionBankData] = useState<QuestionBankData[]>([]);

  // For Loading Page
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get Question Banks Data
  const getQuestionBank = async () => {
    setIsLoading(true);
    const message: any = await GET_QUESTION_BANK();
    if (message.request.status) {
      setQuestionBankData(message.data.message);
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
    setIsLoading(false);
  };

  // Get Question Bank Data When Page Load
  useEffect(() => {
    getQuestionBank();
  }, []);

  return (
    <main className="min-h-[calc(100vh-100px)] py-[50px]">
      <TitleForPage titleText="بنوك الاسئلة"></TitleForPage>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
          {questionBankData.length ? (
            questionBankData.map((bank) => {
              return (
                <div
                  key={bank.id}
                  className="box shadow-xl rounded-xl p-5 bg-gray-300 border-2 border-gray-400 h-[250px] flex flex-col justify-center gap-2"
                >
                  <h2 className="text-center bg-white p-5 rounded-xl text-xl font-extrabold my-5">{bank.name}</h2>
                  <Button as={Link} href={`/mangement/questionBank/review/${bank.id}?numberOfPage=1`} fullWidth size="lg" color="primary" className="text-xl font-bold h-fit p-5">
                    استعراض
                  </Button>
                </div>
              );
            })
          ) : (
            <Empty textForBtn="اضافة بنك اسئلة" urlForBtn="/mangement/questionBank/add"></Empty>
          )}
        </div>
      )}
    </main>
  );
};

export default ReviewQuestionBank;
