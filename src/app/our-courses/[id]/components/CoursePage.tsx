"use client";

import React, { useEffect, useState } from "react";
import { GET_SINGLE_COURSE } from "@/app/fetchApi/our-course/getSingleCourse";
import { CoruseWithSections } from "@/app/utils/interfaces/ourCourses";
import Swal from "sweetalert2";
import Empty from "@/app/components/empty/Empty";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import Loader from "@/app/components/Loading/Loader";
import SectionOfCourse from "./Section";
import AddNewSection from "./AddNewSection";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";

interface Props {
  idCourse: string;
  verfiyToken: jwtPayLoad;
}

const CoursePage: React.FC<Props> = ({ idCourse, verfiyToken }) => {
  const [courseData, setCourseData] = useState<CoruseWithSections>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState(false);

  // GET SINGLE COURSE DATA
  const getSingleCourse = async (id: string) => {
    setIsLoading(true);

    // GET SINGLE COURSE
    const message: any = await GET_SINGLE_COURSE(id);

    if (message.request.status == 200) {
      setCourseData(message.data.message);
    } else {
      Swal.fire({
        title: "خطأ",
        text: message.response.data.message,
        icon: "error",
      });
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // useEffect to get single course when reload is changes
  useEffect(() => {
    getSingleCourse(idCourse);
  }, [reload]);

  return (
    <main className="min-h-[calc(100vh-64px)] py-[50px] relative">
      {courseData && <TitleForPage titleText={courseData.courseName} />}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {courseData ? (
            <>
              {courseData.sections.length ? (
                <div className="container relative z-10">
                  <div
                    className="boxs 
                    flex flex-wrap 
                    !max-w-full gap-5"
                  >
                    {courseData.sections.map((i) => {
                      return (
                        <SectionOfCourse
                          setReload={setReload}
                          reload={reload}
                          courseId={courseData.id}
                          verfiyToken={verfiyToken}
                          id={i.id}
                          title={i.title}
                          details={i.details}
                          key={i.id}
                        />
                      );
                    })}
                  </div>
                  {verfiyToken?.isAdmin && <AddNewSection idCourse={idCourse} reload={reload} setReload={setReload} />}
                </div>
              ) : (
                <Empty textForBtn="تصفح الدورات" urlForBtn="/our-courses">
                  {verfiyToken?.isAdmin && <AddNewSection idCourse={idCourse} reload={reload} setReload={setReload} />}
                </Empty>
              )}
            </>
          ) : (
            <div>
              <TitleForPage titleText="لا يوجد دورة بهذا ال ID" />
              <Empty textForBtn="تصفح الدورات" urlForBtn="/our-courses" />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default CoursePage;
