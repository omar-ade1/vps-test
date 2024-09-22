"use client";

import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddQuizBtn from "./components/addQuizBtn/AddQuizBtn";
import QuizBox from "./components/quizBox/QuizBox";
import { GET_QUESTION_FOR_EXAM } from "@/app/fetchApi/questionForExam/getQuestionForExam";
import Swal from "sweetalert2";
import Loader from "@/app/components/Loading/Loader";
import Empty from "@/app/components/empty/Empty";

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

const QuestionsPage = () => {
  const courseId = useSearchParams().get("courseId");
  const sectionId = useSearchParams().get("sectionId");
  const mediaSectionId = useSearchParams().get("mediaSectionId");
  const type = useSearchParams().get("type");
  const partOfSectionId = useSearchParams().get("partOfSectionId") as string;
  const testId = useSearchParams().get("testId") as string;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);

  const [questionsData, setQuestionData] = useState<QuestionData[]>([]);

  const getQuestion = async () => {
    setIsLoading(true);
    if (courseId && testId) {
      const message: any = await GET_QUESTION_FOR_EXAM(courseId, testId);
      if (message.request.status === 200) {
        setQuestionData(message.data.message);
      } else {
        Swal.fire({
          title: "خطأ",
          text: message.response.data.message,
          icon: "error",
        });
      }
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
  }, [reload]);

  return (
    <main className="min-h-[calc(100vh-64px)] pt-[50px] pb-[100px] relative">
      <TitleForPage titleText="إدارة الأسئلة" />

      {isLoading ? (
        <Loader />
      ) : questionsData.length ? (
        <div className="container relative z-10 grid gap-5 my-5">
          <AddQuizBtn setReload={setReload} reload={reload} courseId={courseId} mediaSectionId={mediaSectionId} testId={testId} />

          {questionsData.map((question, i) => {
            return (
              <QuizBox
                i={i}
                setReload={setReload}
                reload={reload}
                courseId={courseId}
                mediaSectionId={mediaSectionId}
                testId={testId}
                dataQuiz={question.Question}
                key={question.Question.id}
              />
            );
          })}

          <AddQuizBtn setReload={setReload} reload={reload} courseId={courseId} mediaSectionId={mediaSectionId} testId={testId} />
        </div>
      ) : (
        <div>
          <Empty
            textForBtn="عودة الي الاختبار"
            urlForBtn={`/mediaSection?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&type=${type}`}
          >
            <div className="mt-4">
              <AddQuizBtn setReload={setReload} reload={reload} courseId={courseId} mediaSectionId={mediaSectionId} testId={testId} />
            </div>
          </Empty>
        </div>
      )}
    </main>
  );
};

export default QuestionsPage;
