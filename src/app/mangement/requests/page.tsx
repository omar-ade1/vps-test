import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Reuqests = () => {
  return (
    <div>
      <main className="min-h-[calc(100vh-100px)] pt-[50px] pb-[100px] ">
        <TitleForPage titleText="ادارة بنوك الاسئلة" />
        

        
        <div className="container flex flex-wrap justify-evenly items-center gap-5 relative z-10">
        <div className="box shadow-xl  w-[300px] h-[300px] rounded-xl overflow-hidden hover:translate-y-2 transition-transform duration-200">
          <Button
            as={Link}
            href="/mangement/requests/add"
            fullWidth
            variant="shadow"
            color="success"
            radius="lg"
            className="h-full flex justify-center items-center text-xl font-extrabold"
          >
            قبول مشتركين
          </Button>
        </div>

        

        <div className="box shadow-xl  w-[300px] h-[300px] rounded-xl overflow-hidden hover:translate-y-2 transition-transform duration-200">
          <Button
            as={Link}
            href="/mangement/requests/delete"
            fullWidth
            variant="shadow"
            color="danger"
            radius="lg"
            className="h-full flex justify-center items-center text-xl font-extrabold"
          >
            حذف مشتركين
          </Button>
        </div>
      </div>























      </main>
    </div>
  );
};

export default Reuqests;
