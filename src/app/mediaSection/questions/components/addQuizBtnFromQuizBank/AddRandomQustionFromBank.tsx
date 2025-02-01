import { ADD_QUESTION_BY_BANK } from "@/app/fetchApi/questionForExam/addQuestionsByBank";
import { QuestionBank } from "@/app/utils/interfaces/questionBanks";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  bankData: QuestionBank;
  courseId: string | null;
  testId: string | null;
}

const AddRandomQustionFromBank: React.FC<Props> = ({ bankData, courseId, testId }) => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState(false);
  const [isLoadingAddQuestion, setIsLoadingAddQuestion] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // التحقق من أن القيمة تحتوي على أرقام فقط
    if (/^\d*$/.test(inputValue)) {
      const numericValue = parseInt(inputValue, 10);

      // التحقق من أن القيمة ضمن النطاق المطلوب (1-50)
      if (numericValue >= 1 && numericValue <= bankData.questions.length) {
        setValue(inputValue);
        setError(false);
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }
  };

  const chooseRandomQuestion = async () => {
    setIsLoadingAddQuestion(true);
    const chosenQuestions = [];
    const chosenIndexes = [] as number[]; // مصفوفة لتخزين الأرقام العشوائية التي تم اختيارها

    for (let i = 0; i < parseInt(value); i++) {
      let randomNumber;
      // التأكد من أن الرقم لم يتم اختياره من قبل
      do {
        randomNumber = Math.floor(Math.random() * bankData.questions.length);
      } while (chosenIndexes.includes(randomNumber));

      chosenQuestions.push(bankData.questions[randomNumber]);
      chosenIndexes.push(randomNumber); // إضافة الرقم إلى المصفوفة
    }

    console.log(chosenQuestions);

    try {
      // تنفيذ كل الطلبات في نفس الوقت وانتظار انتهائها
      await Promise.all(
        chosenQuestions.map(async (question) => {
          if (courseId && testId && bankData.id) {
            try {
              const message: any = await ADD_QUESTION_BY_BANK(courseId, testId, question.id, bankData.id);

              if (message.request.status === 200) {
                toast.success(message.data.message);
              } else {
                toast.error(message.response.data.message);
              }
            } catch (error: any) {
              toast.error("حدث خطأ أثناء الإضافة");
            }
          }
        })
      );
    } finally {
      setIsLoadingAddQuestion(false);
    }
  };

  return (
    <div className="my-10 border p-5 rounded-md">
      <h3 className="text-xl font-bold">اضافة اسئلة عشوائية من البنك</h3>
      <div className="mt-5">
        <Input
          isInvalid={error}
          label="اكتب عدد الأسئلة "
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-" || e.key === ".") {
              e.preventDefault();
            }
          }}
        />
        {error && <p style={{ color: "red" }}>الرجاء إدخال رقم صحيح بين 1 و 50 فقط. والتأكد ان الرقم المدخل ليس اكبر من عدد الاسئلة في البنك</p>}
      </div>

      <Button
        onClick={() => {
          chooseRandomQuestion();
        }}
        className="my-5 block mx-auto w-[400px] max-w-full"
        size="lg"
        color="primary"
        isLoading={isLoadingAddQuestion}
        isDisabled={value === "" || error}
      >
        إضافة
      </Button>
    </div>
  );
};

export default AddRandomQustionFromBank;
