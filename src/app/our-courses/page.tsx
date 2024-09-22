"use client";

import React, { useEffect, useState } from "react";
import TitleForPage from "../components/titleForPage/TitleForPage";
import { Course } from "@prisma/client";
import { GET_ALL_COURSES } from "../fetchApi/our-course/getCourses";
import Empty from "../components/empty/Empty";
import Loader from "../components/Loading/Loader";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

const CoursesPage = () => {
  const [coursesData, setCoursesData] = useState<Course[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCoursesFromDatabase = async () => {
    setIsLoading(true);
    const message: any = await GET_ALL_COURSES();
    if (message.request.status == 200) {
      setCoursesData(message.data.message);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    getCoursesFromDatabase();
  }, []);

  return (
    <main className="min-h-[calc(100vh-100px)] py-[50px]">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <TitleForPage titleText="الدورات" />{" "}
          {coursesData?.length ? (
            <div className="container relative z-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {coursesData.map((course) => {
                return (
                  <Card isHoverable isPressable shadow="lg" key={course.id} className="py-4 rounded-xl border-2 bg-white">
                    <CardHeader className="flex-col items-start">
                      <p className={`text-2xl font-bold text-orange-600`}>{course.courseName}</p>
                      <h4 className={`text-xl font-bold`}>{course.courseSubName}</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 relative">
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl max-w-full w-[400px] block mx-auto"
                        width={200}
                        height={200}
                        src={`/${process.env.NEXT_PUBLIC_PATH_FOR_IMAGE_COURSES}/${course.courseImg}`}
                      />
                    </CardBody>

                    <CardFooter>
                      <Button
                        fullWidth
                        variant="ghost"
                        color="primary"
                        size="lg"
                        className="text-xl font-bold h-fit p-5"
                        href={`our-courses/${course.id}?courseName=${course.courseName}`}
                        as={Link}
                      >
                        أبدأ الان
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Empty textForBtn="عودة للصفحة الرئيسية" urlForBtn="/" />
          )}
        </>
      )}
    </main>
  );
};

export default CoursesPage;
