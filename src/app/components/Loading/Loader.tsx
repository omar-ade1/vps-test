import { Spinner } from "@nextui-org/react";
import React from "react";

const Loader = () => {
  return (
    <div >
      <div className="z-20 w-full h-screen fixed inset-0 bg-black opacity-90"></div>
      <div className="z-30 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col gap-5">
        <div className="text-7xl text-orange-600 animate-pulse font-[logo-font]">الوجيز</div>
        <Spinner labelColor="primary" size="lg" label="جاري التحميل ..." color="primary" />
      </div>
    </div>
  );
};

export default Loader;
