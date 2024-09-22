import React from "react";
import VideoAndBtn from "./components/VideoAndBtn";
import { cookies } from "next/headers";
import { tokenInfo } from "../utils/tokenVerify";
import { jwtPayLoad } from "../utils/interfaces/jwtPayload";

const VideoPage = () => {
  const token = cookies().get("jwtToken")?.value as string;
  const verfiyToken = tokenInfo() as jwtPayLoad;

  return (
    <main className="min-h-[calc(100vh-64px)] pt-[50px] pb-[100px] relative">
      <VideoAndBtn verfiyToken={verfiyToken} />
    </main>
  );
};

export default VideoPage;
