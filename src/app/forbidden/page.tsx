import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Forbidden = () => {
  return (
    <main className="min-h-[calc(100vh-100px)] flex items-center justify-center">
      <div className="container flex items-center justify-center flex-col">
        <h2 className="font-extrabold text-4xl text-red-600 text-center smT0:text-2xl">Forbidden Error 403</h2>
        <h2 className="mt-5 text-3xl font-extrabold text-center smT0:text-xl">تم رفض الوصول لهذه الصفحة لانك لا تملك اذن الوصول</h2>
        <Button
          as={Link}
          href="/"
          size="lg"
          variant="shadow"
          color="primary"
          className="w-fit h-fit p-5  my-5 font-bold text-xl smT0:text-lg smT0:p-3 smT0:font-normal"
        >
          العودة للصفحة الرئيسية
        </Button>
      </div>
    </main>
  );
};

export default Forbidden;
