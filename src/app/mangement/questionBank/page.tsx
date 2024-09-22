import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const QuestionBank = () => {
  return (
    <main className="min-h-[calc(100vh-100px)] py-[50px] flex flex-col justify-center items-center">
      <TitleForPage titleText="ادارة بنوك الاسئلة" />

      <div className="container flex flex-wrap justify-evenly items-center gap-5 relative z-10">
        <div className="box shadow-xl  w-[300px] h-[300px] rounded-xl overflow-hidden hover:translate-y-2 transition-transform duration-200">
          <Button
            as={Link}
            href="/mangement/questionBank/add"
            fullWidth
            variant="shadow"
            color="success"
            radius="lg"
            className="h-full flex justify-center items-center text-xl font-extrabold"
          >
            اضافة
          </Button>
        </div>

        <div className="box shadow-xl  w-[300px] h-[300px] rounded-xl overflow-hidden hover:translate-y-2 transition-transform duration-200">
          <Button
            as={Link}
            href="/mangement/questionBank/review"
            fullWidth
            variant="shadow"
            color="primary"
            radius="lg"
            className="h-full flex justify-center items-center text-xl font-extrabold"
          >
            استعراض
          </Button>
        </div>

        <div className="box shadow-xl  w-[300px] h-[300px] rounded-xl overflow-hidden hover:translate-y-2 transition-transform duration-200">
          <Button
            as={Link}
            href="/mangement/questionBank/delete"
            fullWidth
            variant="shadow"
            color="danger"
            radius="lg"
            className="h-full flex justify-center items-center text-xl font-extrabold"
          >
            حذف
          </Button>
        </div>
      </div>
    </main>
  );
};

export default QuestionBank;
