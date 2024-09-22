"use client";

import { GET_ALL_COURSES } from "@/app/fetchApi/our-course/getCourses";
import React, { useEffect, useState } from "react";
import CardFUpdate from "./components/Card";
import { AnimatePresence } from "framer-motion";
import Loader from "@/app/components/Loading/Loader";
import Empty from "@/app/components/empty/Empty";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";

interface CoursesData {
  id: number;
  courseName: string;
  courseSubName: string;
  courseImg: string;
}

const UpdateCourse = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [coursesData, setCoursesData] = useState<CoursesData[]>();
  const [reload, setReload] = useState(false);

  // This To Get Data Of Courses From Database
  const handelGetUrls = async () => {
    setIsLoading(true);
    const message: any = await GET_ALL_COURSES();
    if (message.request.status == 200) {
      setCoursesData(message.data.message);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // Get Courses Data
  useEffect(() => {
    handelGetUrls();
  }, [reload]);

  // Stop Scrolling Whill Page Is Loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  return (
    <div className="min-h-[calc(100vh-100px)] py-[50px]">
      <TitleForPage titleText="التعديل على الدورات"/>
      {isLoading && <Loader />}
      {coursesData?.length ?
      <div className="container grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 relative z-10">
        {coursesData?.map((course) => {
          return <CardFUpdate key={course.id} reload={reload} setReload={setReload} course={course} setIsLoading={setIsLoading} />;
        })}
      </div>
      
        : 
        <Empty urlForBtn="/mangement/our-courses/add" textForBtn="إضافة دورات" />

      }
    </div>
  );
};

export default UpdateCourse;
