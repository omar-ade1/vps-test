"use client";

import { GET_QUESTION_FOR_EXAM } from "@/app/fetchApi/questionForExam/getQuestionForExam";
import { Spinner } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import QuizBoxInExamPage from "./components/QuizBox";
import EndExamBtn from "./components/EndExamBtn";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";

interface QuestionData {
  Question: {
    id: number;
    questionBankId: number;
    testId: number;
    questionText: string;
    questionSection: string;
    createdAt: string;
    updatedAt: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    asnwerTrue: number;
  };
}

const ExamPage = () => {
  const courseId = useSearchParams().get("courseId");
  const testId = useSearchParams().get("testId") as string;
  const sectionId = useSearchParams().get("sectionId") as string;
  const title = useSearchParams().get("title") as string;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [questionsData, setQuestionData] = useState<QuestionData[]>([]);

  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});

  const handelResult = () => {
    let correctAnswers = 0;
    let wrongAnswers = 0;

    questionsData.forEach((question) => {
      const userAnswer = userAnswers[question.Question.id];

      if (userAnswer === question.Question.asnwerTrue) {
        correctAnswers += 1;
      } else {
        wrongAnswers += 1;
      }
    });

    return { correctAnswers, wrongAnswers };
  };

  const getQuestion = async () => {
    setIsLoading(true);
    if (courseId && testId) {
      const message: any = await GET_QUESTION_FOR_EXAM(courseId, testId);
      setQuestionData(message.data.message);
    } else {
      Swal.fire({
        title: "خطأ",
        text: "البيانات في الطلب غير مكتملة",
        icon: "error",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue = ""; // Required for modern browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] pt-[50px] py-[100px] relative">
      <TitleForPage titleText={title} />
      {isLoading ? (
        <Spinner
          size="lg"
          label="يتم التحميل ..."
          labelColor="primary"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ></Spinner>
      ) : questionsData.length ? (
        <div className="container flex flex-col gap-4 relative z-10">
          <div className="space-y-5">
            {questionsData.map((question, i) => {
              return <QuizBoxInExamPage key={question.Question.id} setUserAnswers={setUserAnswers} question={question.Question} i={i} />;
            })}
          </div>
          <EndExamBtn
            testId={testId}
            courseId={courseId}
            sectionId={sectionId}
            userAnswers={userAnswers}
            questionsData={questionsData}
            handelResult={handelResult}
          />
        </div>
      ) : (
        <div>
          <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-center">هذا الاختبار ليس به اسئلة</h2>
        </div>
      )}
    </main>
  );
};

export default ExamPage;
