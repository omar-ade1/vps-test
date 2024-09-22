"use client";

import Empty from "@/app/components/empty/Empty";
import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { DELETE_QUESTION_BANK } from "@/app/fetchApi/questionBank/deleteQuestionBank";
import { GET_QUESTION_BANK } from "@/app/fetchApi/questionBank/getAllQuestionBank";
import { Toast } from "@/app/utils/alert";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import BoxOfQuestionBank from "./components/BoxOfQuestionBank";

interface QuestionBankData {
  id: number;
  name: string;
}

const DeleteQuestionBank = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [questionBankData, setQuestionBankData] = useState<QuestionBankData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);

  const getQuestionBank = async () => {
    setIsLoading(true);
    const message: any = await GET_QUESTION_BANK();
    if (message.request.status === 200) {
      setQuestionBankData(message.data.message);
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

  useEffect(() => {
    getQuestionBank();
  }, [reload]);

  const deleteQuestionBank = async (id: number) => {
    setIsLoading(true);
    const message: any = await DELETE_QUESTION_BANK(id);
    if (message.request.status === 200) {
      Toast.fire({
        title: message.data.message,
        icon: "success",
      });
      setReload(!reload);
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
      <TitleForPage titleText="حذف بنوك الاسئلة"></TitleForPage>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container relative z-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
          {questionBankData.length ? (
            questionBankData.map((bank) => {
              return <BoxOfQuestionBank key={bank.id} bankData={bank} reload={reload} setReload={setReload} setIsLoading={setIsLoading} />;
            })
          ) : (
            <Empty textForBtn="اضافة بنك اسئلة" urlForBtn="/mangement/questionBank/add"></Empty>
          )}
        </div>
      )}
    </main>
  );
};

export default DeleteQuestionBank;
