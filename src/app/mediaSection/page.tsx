"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import OldResultsTable from "./components/OldResultsTable";
import TitleForPage from "../components/titleForPage/TitleForPage";
import { getTokenData } from "../utils/checkIfUserSubInCourse";
import Swal from "sweetalert2";
import { jwtPayLoad } from "../utils/interfaces/jwtPayload";

const MediaSectionPage = () => {
  // IDS From Params In URL
  const courseId = useSearchParams().get("courseId");
  const sectionId = useSearchParams().get("sectionId");
  const mediaSectionId = useSearchParams().get("mediaSectionId");
  const type = useSearchParams().get("type");
  const partOfSectionId = useSearchParams().get("partOfSectionId") as string;
  const testId = useSearchParams().get("testId") as string;
  const title = useSearchParams().get("title") as string;

  // State For Token
  const [tokenData, setTokenData] = useState<jwtPayLoad>();

  // Get Token
  const getToken = async () => {
    const token = await getTokenData();
    if (typeof token === "object") {
      setTokenData(token);
    } else {
      Swal.fire({
        title: token,
        icon: "error",
      });
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] py-[50px] relative">
      <div className="container relative z-10">
        <TitleForPage titleText={title} />

        {/* Start Setting Bar */}
        {tokenData?.isAdmin == true && (
          <div className="setting-bar border shadow-xl p-5 rounded-xl flex justify-center items-center gap-2 bg-gray-700 ">
            <Button
              as={Link}
              href={`/mediaSection/setting?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&type=${type}`}
              variant="shadow"
              color="primary"
              size="lg"
              className="text-xl font-bold h-fit p-4"
            >
              الاعدادات
            </Button>

            <Button
              as={Link}
              href={`/mediaSection/questions?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&type=${type}&testId=${testId}`}
              variant="shadow"
              color="warning"
              size="lg"
              className="text-xl font-bold h-fit p-4 "
            >
              الاسئلة
            </Button>

            <Button
              as={Link}
              href={`/mediaSection/results?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&type=${type}&testId=${testId}&title=${title}`}
              variant="shadow"
              color="success"
              size="lg"
              className="text-xl font-bold h-fit p-4 "
            >
              النتائج
            </Button>
          </div>
        )}
        {/* End Setting Bar */}

        {/* Start Exam Btn */}
        <div className="exam-btn mt-10 w-[300px] h-[200px] mx-auto">
          <Button
            as={Link}
            href={`/mediaSection/examPage?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&type=${type}&testId=${testId}&title=${title}`}
            color="primary"
            variant="shadow"
            size="lg"
            className="text-xl flex justify-center items-center font-bold p-5  w-full h-full"
          >
            ابدأ الاختبار ألان
          </Button>
        </div>
        {/* End Exam Btn */}

        {/* Start Table Of Old Results */}
        <OldResultsTable courseId={courseId} testId={testId} />
        {/* End Table Of Old Results */}
      </div>
    </main>
  );
};

export default MediaSectionPage;
