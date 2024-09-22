"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const NotePage = () => {
  const courseId = useSearchParams().get("courseId");
  const sectionId = useSearchParams().get("sectionId");
  const mediaSectionId = useSearchParams().get("mediaSectionId");
  const type = useSearchParams().get("type");
  const partOfSectionId = useSearchParams().get("partOfSectionId") as string;

  return (
    <main className="min-h-[calc(100vh-64px)] py-[50px] relative">
      <div className="container">
        <div className="setting-bar border shadow-xl p-5 rounded-xl flex justify-center items-center gap-2 bg-gray-700 ">
          <Button
            as={Link}
            href={`/notePage/setting?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&type=${type}`}
            variant="shadow"
            color="primary"
            size="lg"
            className="text-xl font-bold h-fit p-4"
          >
            الاعدادات
          </Button>
        </div>

        <div className="video-site max-w-full w-[1000px] h-[500px] border-2 border-black rounded-xl shadow-2xl mt-5 mx-auto"></div>
      </div>
    </main>
  );
};

export default NotePage;
