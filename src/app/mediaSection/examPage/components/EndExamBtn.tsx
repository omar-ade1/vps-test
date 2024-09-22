"use client";

import { ADD_NEW_RESULT_FOR_EXAM } from "@/app/fetchApi/handelResultOfExam/addNewResult";
import { Toast } from "@/app/utils/alert";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Radio, RadioGroup } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

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

interface Props {
  handelResult: () => { correctAnswers: number; wrongAnswers: number };
  questionsData: QuestionData[];
  userAnswers: { [key: number]: number };
  courseId: string | null;
  sectionId: string | null;
  testId: string | null;
}

interface InputsValues {
  allResult: number;
  wrongeAnswer: number;
  correctAnswer: number;
}

const EndExamBtn: React.FC<Props> = ({ handelResult, questionsData, userAnswers, courseId, sectionId, testId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { correctAnswers, wrongAnswers } = handelResult();

  const handelBackEndResult = async () => {
    if (courseId && testId) {
      const data: InputsValues = {
        allResult: correctAnswers + wrongAnswers,
        correctAnswer: correctAnswers,
        wrongeAnswer: wrongAnswers,
      };
      const message: any = await ADD_NEW_RESULT_FOR_EXAM(data, courseId, testId);
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
    }
  };

  const alertConfirm = () => {
    Swal.fire({
      title: "هل أنت متأكد ؟",
      text: "هل تريد انهاء هذا الاختبار",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم ,إنهاء",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        handelBackEndResult();
        onOpen();
      }
    });
  };

  const router = useRouter();

  return (
    <>
      <Button
        onClick={() => {
          alertConfirm();
        }}
        variant="shadow"
        color="primary"
        className="text-xl font-bold h-fit p-5 min-w-[200px] my-10 block mx-auto"
      >
        إنهاء الاختبار
      </Button>

      <Modal
        onClose={() => {
          router.replace(`/our-courses/${courseId}/${sectionId}`);
        }}
        scrollBehavior="inside"
        className="!h-full"
        classNames={{
          base: "!h-screen !max-h-screen",
        }}
        size="full"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-3xl font-extrabold text-center">النتيجة</ModalHeader>
              <h2 className="text-lg font-bold text-green-600 text-center ">
                الاجابات الصحيحة : {correctAnswers} من أصل {questionsData.length}
              </h2>
              <h2 className="text-lg font-bold text-red-600 text-center ">
                الاجابات الخاطئة : {wrongAnswers} من أصل {questionsData.length}
              </h2>
              <h2 className="text-lg font-bold text-center mb-2">النسبة المئوية : {((correctAnswers / questionsData.length) * 100).toFixed(2)}%</h2>
              <ModalBody className="container">
                {questionsData.map((question, i) => {
                  return (
                    <div key={question.Question.id}>
                      <div
                        className={`quiz bg-slate-200 border-2  border-slate-200 p-5 
                          ${userAnswers[question.Question.id] != question.Question.asnwerTrue ? "border-2 border-red-500" : ""}
                        `}
                      >
                        <h2 className="text-xl font-bold text-primary">{question.Question.questionSection}</h2>
                        <h3 className="font-bold text-xl my-5 text-center">
                          {`(${i + 1}) `}
                          {question.Question.questionText}
                        </h3>
                        <div className="answer grid grid-cols-2 smT0:grid-cols-1 !flex-row gap-5 w-fit mx-auto relative">
                          <div
                            className={`flex items-center rounded ${
                              userAnswers[question.Question.id] == 1 && userAnswers[question.Question.id] != question.Question.asnwerTrue
                                ? "bg-red-500"
                                : ""
                            } ${question.Question.asnwerTrue == 1 ? "bg-green-500" : ""}`}
                          >
                            <h4 className={`text-center font-bold p-2`}>أ) {question.Question.answer1}</h4>
                          </div>

                          <div
                            className={`flex items-center rounded ${
                              userAnswers[question.Question.id] == 2 && userAnswers[question.Question.id] != question.Question.asnwerTrue
                                ? "bg-red-500"
                                : ""
                            } ${question.Question.asnwerTrue == 2 ? "bg-green-500" : ""}`}
                          >
                            <h4 className={`text-center font-bold p-2`}>ب) {question.Question.answer2}</h4>
                          </div>

                          <div
                            className={`flex items-center rounded ${
                              userAnswers[question.Question.id] == 3 && userAnswers[question.Question.id] != question.Question.asnwerTrue
                                ? "bg-red-500"
                                : ""
                            } ${question.Question.asnwerTrue == 3 ? "bg-green-500" : ""}`}
                          >
                            <h4 className={`text-center font-bold p-2`}>ج) {question.Question.answer3}</h4>
                          </div>

                          <div
                            className={`flex items-center rounded ${
                              userAnswers[question.Question.id] == 4 && userAnswers[question.Question.id] != question.Question.asnwerTrue
                                ? "bg-red-500"
                                : ""
                            } ${question.Question.asnwerTrue == 4 ? "bg-green-500" : ""}`}
                          >
                            <h4 className={`text-center font-bold p-2`}>د) {question.Question.answer4}</h4>
                          </div>
                        </div>
                        <div>
                          {userAnswers[question.Question.id] ? (
                            userAnswers[question.Question.id] == question.Question.asnwerTrue ? (
                              <h3 className="text-xl font-bold p-2 bg-success w-fit my-5 rounded">إجابتك صحيحة</h3>
                            ) : (
                              <h3 className="text-xl font-bold p-2 bg-danger text-white w-fit my-5 rounded">إجابتك خاطئة</h3>
                            )
                          ) : (
                            <h3 className="text-xl font-bold p-2 bg-red-600 text-white w-fit my-5 rounded">هذا السؤال ترك فارغ بدون حل</h3>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ModalBody>
              <ModalFooter>
                <Button className="h-fit text-lg font-bold p-3" color="primary" onPress={onClose}>
                  العودة للدورة
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EndExamBtn;
