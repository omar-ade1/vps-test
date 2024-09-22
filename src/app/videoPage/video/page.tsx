"use client";

import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { Button } from "@nextui-org/react";
import React from "react";

const VideoSetting = () => {
  return (
    <main className="min-h-[calc(100vh-64px)] py-[50px] relative">
      <TitleForPage titleText="الفيديو" />
      <div className="container">
        <Button color="success" className="w-[300px] h-[300px] text-xl font-bold mx-auto block">
          تحميل فيديو
        </Button>
      </div>
    </main>
  );
};

export default VideoSetting;
