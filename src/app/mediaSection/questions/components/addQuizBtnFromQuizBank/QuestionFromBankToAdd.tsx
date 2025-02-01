"use client";
import { QuestionInBank } from "@/app/utils/interfaces/questionBanks";
import { Button } from "@nextui-org/react";
import React from "react";

interface Props {
  question: QuestionInBank;
  setSelectedQuestionsCount: React.Dispatch<React.SetStateAction<number>>;
  selectedQuestionsCount: number;
  setStartCount: React.Dispatch<React.SetStateAction<boolean>>;
  startCount: boolean;
  setSelectedQuestionsId: React.Dispatch<React.SetStateAction<number[]>>;
}

const QuestionFromBankToAdd: React.FC<Props> = ({
  question,
  selectedQuestionsCount,
  setSelectedQuestionsCount,
  setStartCount,
  startCount,
  setSelectedQuestionsId,
}) => {
  const [selected, setSelected] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (startCount) {
      if (selected) {
        setSelectedQuestionsCount((prev) => prev + 1);
        setSelectedQuestionsId((prev) => [...prev, question.id]);
      } else {
        setSelectedQuestionsCount((prev) => prev - 1);
        setSelectedQuestionsId((prev) => prev.filter((id) => id !== question.id));
      }
    }
  }, [selected]);

  return (
    <div key={question.id} className={`${selected ? "bg-green-200" : "bg-white"} p-2 border border-gray-300 rounded-md `}>
      <h2 className="font-bold text-xl text-primary p-2">{question.questionSection}</h2>
      <h3>{question.questionText}</h3>
      <Button
        onClick={() => {
          setSelected(!selected);
          if (startCount === false) {
            setStartCount(true);
          }
        }}
        className="my-3"
        size="lg"
        color={selected ? "danger" : "success"}
        variant="shadow"
      >
        {selected ? "إلغاء الاختيار" : "اختيار"}
      </Button>
    </div>
  );
};

export default QuestionFromBankToAdd;
