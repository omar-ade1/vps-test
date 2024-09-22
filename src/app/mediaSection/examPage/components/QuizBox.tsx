"use client";

import { Radio, RadioGroup } from "@nextui-org/react";
import React, { SetStateAction, useState } from "react";

interface Props {
  question: {
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
  i: number;
  setUserAnswers: React.Dispatch<SetStateAction<any>>;
}

const QuizBoxInExamPage: React.FC<Props> = ({ question, i, setUserAnswers }) => {
  const [userSlove, setUserSlove] = useState<string>();

  const handleAnswerSelect = (selectedAnswer: number) => {
    setUserAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [question.id]: selectedAnswer,
    }));
  };

  return (
    <div className="quiz bg-slate-200 border-2  border-slate-200 p-5">
      <h2 className="text-xl font-bold text-primary">{question.questionSection}</h2>
      <h3 className="font-bold text-xl my-5 text-center">
        {`(${i + 1}) `}
        {question.questionText}
      </h3>
      <div className="answer flex justify-center w-full relative">
        <RadioGroup
          onValueChange={(e) => {
            handleAnswerSelect(parseInt(e));
          }}
          classNames={{
            wrapper: "grid grid-cols-2 smT0:grid-cols-1 !flex-row w-full gap-5",
          }}
          className="flex justify-around items-center flex-row relative"
        >
          <div className="flex items-center">
            <Radio value={"1"} />
            <h4 className={`text-center font-bold p-2`}>أ) {question.answer1}</h4>
          </div>

          <div className="flex items-center">
            <Radio value={"2"} />
            <h4 className={`text-center font-bold p-2`}>ب) {question.answer2}</h4>
          </div>

          <div className="flex items-center">
            <Radio value={"3"} />
            <h4 className={`text-center font-bold p-2`}>ج) {question.answer3}</h4>
          </div>

          <div className="flex items-center">
            <Radio value={"4"} />
            <h4 className={`text-center font-bold p-2`}>د) {question.answer4}</h4>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default QuizBoxInExamPage;
