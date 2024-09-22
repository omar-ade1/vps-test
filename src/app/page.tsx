"use client";

import React, { useEffect, useState } from "react";

import LandingSection from "@/app/components/home/LandingSection";

import OurDegrees from "./components/home/OurDegrees";
import OurCourses from "./components/home/OurCourses";
import Loader from "./components/Loading/Loader";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [loadingDegreeImg, setLoadingDegreeImg] = useState<boolean>(true);
  const [loadingCoursesData, setLoadingCoursesData] = useState<boolean>(true);

  useEffect(() => {
    if (loadingCoursesData && loadingDegreeImg) {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
}
  },[loadingDegreeImg, loadingCoursesData])

  return (
    <main className="overflow-hidden min-h-[calc(100vh-64px)]">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="pb-[50px] bg-gray-200">
            <LandingSection />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 100" width="100%">
              <path
                d="M -358.40000000000003 50 Q -278.4 50 -198.4 75 Q -38.4 125 121.6 75 Q 201.6 50 281.6 50 Q 361.6 50 441.6 75 Q 601.6 125 761.6 75 Q 841.6 50 921.6 50 Q 1001.6 50 1081.6 75 Q 1241.6 125 1401.6 75 Q 1481.6 50 1561.6 50 L 1280 0 L 0 0 Z"
                fill="#fefef2"
              ></path>
            </svg>
          </div>

          <div className="py-[50px] bg-gray-200">
            <OurDegrees setLoadingDegreeImg={setLoadingDegreeImg} />
          </div>
          <svg className="bg-[#fffef9]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 100" width="100%">
            <path
              d="M -352 50 Q -272 50 -192 75 Q -32 125 128 75 Q 208 50 288 50 Q 368 50 448 75 Q 608 125 768 75 Q 848 50 928 50 Q 1008 50 1088 75 Q 1248 125 1408 75 Q 1488 50 1568 50 L 1280 0 L 0 0 Z"
              fill="#E2E5E8"
            ></path>
          </svg>

          <div>
            <OurCourses setLoadingCoursesData={setLoadingCoursesData} />
          </div>
        </>
      )}
    </main>
  );
}
