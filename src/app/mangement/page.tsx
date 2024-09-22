import React from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import TitleForPage from "../components/titleForPage/TitleForPage";

const Mangement = () => {
  return (
    <main className="min-h-[calc(100vh-64px)] py-[50px]">
      <TitleForPage titleText="الإدارة" />
      <div className="container">
        <div className="boxs grid gap-5 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          <div className="box shadow-lg bg-blue-200 hover:text-white hover:bg-blue-600 group transition duration-200 hover:-translate-y-2 hover:shadow-blue-500 border flex justify-center items-center flex-col gap-5 p-5 rounded-xl min-h-[200px]">
            <h2 className="text-3xl font-extrabold">الدورات</h2>
            <Button
              size="lg"
              color="primary"
              fullWidth
              className="group-hover:bg-orange-600 text-xl h-fit p-5 font-bold"
              as={Link}
              href="/mangement/our-courses"
            >
              انتقال
            </Button>
          </div>

          <div className="box shadow-lg bg-blue-200 hover:text-white hover:bg-blue-600 group transition duration-200 hover:-translate-y-2 hover:shadow-blue-500 border flex justify-center items-center flex-col gap-5 p-5 rounded-xl min-h-[200px]">
            <h2 className="text-3xl font-extrabold">الدرجات</h2>
            <Button
              size="lg"
              color="primary"
              fullWidth
              className="group-hover:bg-orange-600 text-xl h-fit p-5 font-bold"
              as={Link}
              href="/mangement/our-degree"
            >
              انتقال
            </Button>
          </div>

          <div className="box shadow-lg bg-blue-200 hover:text-white hover:bg-blue-600 group transition duration-200 hover:-translate-y-2 hover:shadow-blue-500 border flex justify-center items-center flex-col gap-5 p-5 rounded-xl min-h-[200px]">
            <h2 className="text-3xl font-extrabold">بنوك الاسئلة</h2>
            <Button
              size="lg"
              color="primary"
              fullWidth
              className="group-hover:bg-orange-600 text-xl h-fit p-5 font-bold"
              as={Link}
              href="/mangement/questionBank"
            >
              انتقال
            </Button>
          </div>

          <div className="box shadow-lg bg-blue-200 hover:text-white hover:bg-blue-600 group transition duration-200 hover:-translate-y-2 hover:shadow-blue-500 border flex justify-center items-center flex-col gap-5 p-5 rounded-xl min-h-[200px]">
            <h2 className="text-3xl font-extrabold">ادارة الاشتراكات</h2>
            <Button
              size="lg"
              color="primary"
              fullWidth
              className="group-hover:bg-orange-600 text-xl h-fit p-5 font-bold"
              as={Link}
              href="/mangement/requests"
            >
              انتقال
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Mangement;
