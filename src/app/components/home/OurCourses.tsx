"use client";

import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import Image from "next/image";
import React, { SetStateAction, useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import backgroundTitle from "../../../../public/modern-splash-frame-with-yellow-background (1).png";
import { Cairo } from "next/font/google";
import fff from "../../../../public/fff.jpg";
import Link from "next/link";
import { GET_ALL_COURSES } from "@/app/fetchApi/our-course/getCourses";
import { Course } from "@prisma/client";

const cairo = Cairo({ subsets: ["latin"] });

interface Props {
  setLoadingCoursesData: React.Dispatch<SetStateAction<boolean>>;
}

const OurCourses: React.FC<Props> = ({ setLoadingCoursesData }) => {
  const [coursesData, setCoursesData] = useState<Course[]>();

  const getCoursesFromDatabase = async () => {
    setLoadingCoursesData(true);

    const message: any = await GET_ALL_COURSES();
    if (message.request.status == 200) {
      setCoursesData(message.data.message);
    }

    setLoadingCoursesData(false);
  };
  useEffect(() => {
    getCoursesFromDatabase();
  }, []);

  return (
    <section style={{ backgroundImage: `url(${fff.src})` }} className="relative py-[50px] bg-cover">
      <div className="container">
        <div className="relative w-fit mx-auto text-center flex justify-center items-center flex-col">
          <Image className="absolute w-3/4 block mx-auto" src={backgroundTitle} alt="background title" />
          <h2 className="relative font-[logo-font] text-5xl text-orange-600">الـدورات المـتـاحــة</h2>
        </div>
        <div className=" py-[50px]">
          <Swiper
            pagination={{
              dynamicBullets: true,
              clickable: true,
            }}
            breakpoints={{
              1204: {
                slidesPerView: 2,
              },
              1400: {
                slidesPerView: 3,
              },
            }}
            slidesPerView={1}
            modules={[Autoplay, Pagination, Navigation]}
            navigation={true}
            className="mySwiper h-full flex"
          >
            {coursesData?.map((course) => {
              return (
                <SwiperSlide key={course.id} className="!flex justify-center items-center text-xl font-bold">
                  <Card className="py-4 rounded-xl max-w-[500px] ">
                    <CardHeader className="flex-col items-start">
                      <p className={`${cairo.className} text-2xl font-bold text-orange-600`}>{course.courseName}</p>
                      <h4 className={`${cairo.className} text-xl font-bold`}>{course.courseSubName}</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 relative">
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl max-w-full w-[400px] block"
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
                        href={`/our-courses/${course.id}?courseName=${course.courseName}`}
                        as={Link}
                      >
                        أبدأ الان
                      </Button>
                    </CardFooter>
                  </Card>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default OurCourses;
