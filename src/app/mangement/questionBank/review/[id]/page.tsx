"use client";
import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { GET_SINGLE_QUESTION_BANK } from "@/app/fetchApi/questionBank/getSingleBank";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TbError404 } from "react-icons/tb";
import QuizAction from "./components/QuizAction";
import { Question } from "@/app/utils/interfaces/courseParts";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Toast } from "@/app/utils/alert";
import { GET_BANKS_WITHOUT_QUESTION } from "@/app/fetchApi/questionBank/getBankWithOutQuestion";

interface Bank {
  id: number;
  name: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  _count: {
    questions: number;
  };
}
interface QuestionBankData {
  id: number;
  name: string;
}

const ViewQuestionBank = ({ params }: { params: { id: string } }) => {
  // Id Of Bank From Url
  const idOfBank = params.id;

  // Get Number Of Page From Url
  const numberOfPageFromUrl = useSearchParams().get("numberOfPage");

  // States And Data
  const [questionBank, setQuestionBank] = useState<Bank>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [numberOfCurrentPage, setNumberOfCurrentPage] = useState<string>(numberOfPageFromUrl || "1");
  const [reload, setReload] = useState<boolean>(false);

  const pathname = usePathname(); // let's get the pathname to make the component reusable - could be used anywhere in the project
  const router = useRouter();
  const currentSearchParams = useSearchParams();


  const [questionBankData, setQuestionBankData] = useState<QuestionBankData[]>([]);

  // Handel Get Question Bank Data
  const getQuestionBank = async () => {
    const message: any = await GET_BANKS_WITHOUT_QUESTION();

    // While Succeed
    if (message.request.status === 200) {
      setQuestionBankData(message.data.message);

      // Whill Error
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
  };

  // Run Get Question Bank Function
  useEffect(() => {
    getQuestionBank();
  }, []);






  // Handel Get Single Bank Data With Questions
  const getSingleBank = async () => {
    // Start Loading Page
    setIsLoading(true);
    // If Id Of Bank Is Exist
    if (idOfBank) {
      // Get Single Bank
      const message: any = await GET_SINGLE_QUESTION_BANK(idOfBank, numberOfCurrentPage);

      // If The Request Is Successful
      if (message.request.status === 200) {
        setQuestionBank(message.data.message);
        // Set Number Of Pages According To The Count Of Questions
        setNumberOfPages(Math.ceil(message.data.message._count.questions / 20));

        //todo
        const updatedSearchParams = new URLSearchParams(currentSearchParams.toString());
        updatedSearchParams.set("numberOfPage", numberOfCurrentPage);
        router.replace(pathname + "?" + updatedSearchParams.toString());
        //todo

        // If The Request Is Not Successful
      } else {
        // Show Error Message And Go Back To This Page => (/mangement/questionBank/review)
        Swal.fire({
          title: "حدث خطأ",
          text: message.response.data.message,
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "إغلاق",
        }).then((result) => {
          router.replace("/mangement/questionBank/review");
        });
      }
    }

    // Stop Loading The Page
    setIsLoading(false);
  };

  // Run Get Single Bank Function When Id Of Bank Or Number Of Current Page Changes
  useEffect(() => {
    getSingleBank();
  }, [idOfBank, numberOfCurrentPage, reload]);

  return (
    <main className="min-h-[calc(100vh-100px)] pt-[50px] pb-[100px]">
      <TitleForPage titleText={questionBank?.name || "..."} />
      {isLoading ? (
        <Loader />
      ) : questionBank?.questions.length ? (
        <div className="container relative z-10">
          <div className="questions grid gap-5 ">
            {questionBank.questions.map((question, i) => (
              <div className="box bg-slate-200 border-2 border-slate-200 p-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-primary">{question.questionSection}</h2>
                  <QuizAction banksData={questionBankData} reload={reload} setReload={setReload} questionData={question} bankData={questionBank} numberOfCurrentPage={numberOfCurrentPage} setNumberOfCurrentPage={setNumberOfCurrentPage} />
                </div>

                <pre className={` font-bold text-xl my-5 text-center block max-w-full text-wrap`}>
                  {`(${i + 1 + (Number(numberOfCurrentPage) - 1) * 20}) `}
                  {question.questionText}
                </pre>

                <div className="answer flex flex-wrap smT0:gap-5 justify-around items-center">
                  <h4 className={`w-1/2 smT0:w-full text-center font-bold p-2 ${question.asnwerTrue === 1 ? "bg-success rounded" : ""}`}>
                    أ) {question.answer1}
                  </h4>
                  <h4 className={`w-1/2 smT0:w-full text-center font-bold p-2 ${question.asnwerTrue === 2 ? "bg-success rounded" : ""}`}>
                    ب) {question.answer2}
                  </h4>
                  <h4 className={`w-1/2 smT0:w-full text-center font-bold p-2 ${question.asnwerTrue === 3 ? "bg-success rounded" : ""}`}>
                    ج) {question.answer3}
                  </h4>
                  <h4 className={`w-1/2 smT0:w-full text-center font-bold p-2 ${question.asnwerTrue === 4 ? "bg-success rounded" : ""}`}>
                    د) {question.answer4}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-5 mt-10">
            {Array.from({ length: numberOfPages }).map((_, i) => (
              <div
                onClick={() => setNumberOfCurrentPage(String(i + 1))}
                className={`flex  justify-center items-center border-2 w-[50px] h-[50px] shadow-xl rounded-lg font-bold cursor-pointer hover:bg-gray-800 hover:text-white transition-colors duration-300
                ${numberOfCurrentPage === String(i + 1) ? "bg-black text-white" : ""}
                `}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h2 className="flex justify-center items-center gap-5 flex-col text-2xl font-bold text-center p-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          هذا البنك أو تلك الصفحة ليس بها أسئلة <TbError404 className="text-7xl text-red-600" />
        </h2>
      )}
    </main>
  );
};

export default ViewQuestionBank;
