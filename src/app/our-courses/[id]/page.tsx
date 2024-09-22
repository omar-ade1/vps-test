import React from "react";
import CoursePage from "./components/CoursePage";
import { cookies } from "next/headers";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";

interface Props {
  params: {
    id: string;
  };
}

const Test: React.FC<Props> = ({ params }) => {
  const token = cookies().get("jwtToken")?.value as string;
  const verfiyToken = tokenInfo() as jwtPayLoad;

  return (
    <div>
      <CoursePage verfiyToken={verfiyToken} idCourse={params.id}></CoursePage>
    </div>
  );
};

export default Test;
