import Image from "next/image";
import React from "react";
import noDataImg from "../../../../public/noData.webp";
import { Button } from "@nextui-org/react";
import Link from "next/link";

interface Props {
  urlForBtn: string;
  textForBtn: string;
  children? : any
}

const Empty: React.FC<Props> = ({ urlForBtn, textForBtn,children }) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 my-5 -translate-y-1/2 flex justify-center items-center flex-col text-center">
      <h2 className="w-fit mx-auto text-3xl font-bold smT0:text-2xl xxsm:text-xl">هـذه الـصـفـحـة فـارغـة</h2>
      <Image className="w-[300px] max-w-full" src={noDataImg} alt="لا يوجد بيانات" />
      <Button variant="shadow" color="primary" size="lg" className="h-fit p-5 text-xl font-bold text-center" as={Link} href={urlForBtn}>
        {textForBtn}
      </Button>
      {children}
    </div>
  );
};

export default Empty;
