"use client";

import Empty from "@/app/components/empty/Empty";
import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { DELETE_OUR_COURSE } from "@/app/fetchApi/our-course/deleteCourse";
import { GET_ALL_COURSES } from "@/app/fetchApi/our-course/getCourses";
import { Toast } from "@/app/utils/alert";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import Swal from "sweetalert2";

interface CoursesData {
  id: number;
  courseName: string;
  courseSubName: string;
  courseImg: string;
}

const DeleteCourse = () => {
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

  // This To Delete Data Of Courses From Database
  const handelDeleteCourse = async (id: number) => {
    setIsLoading(true);
    const message: any = await DELETE_OUR_COURSE(String(id));
    if (message.request.status == 200) {
      Toast.fire({
        title: message.data.message,
        icon: "success",
      });
      setReload(!reload);
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  const alert = (id: number) => {
    Swal.fire({
      title: "هل انت متأكد",
      text: "هل تريد مسح هذه الدورة نهائيا من الموقع ؟ يرجى العلم انه سيتم مسح كل شئ يخص الدورة من اقسام و اختبارات وغيره",

      icon: "warning",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#767676",
      confirmButtonText: "نعم! احذفها",
      cancelButtonText: "إلغاء العملية",
    }).then((result) => {
      if (result.isConfirmed) {
        alert2(id);
      }
    });
  };

  const alert2 = (id: number) => {
    Swal.fire({
      title: `تحذير!`,
      text: "بالضغط على موافق فلا يمكن التراجع!",
      icon: "warning",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#767676",
      confirmButtonText: "موافق",
      cancelButtonText: "إلغاء العملية",
    }).then((result) => {
      if (result.isConfirmed) {
        handelDeleteCourse(id);
      }
    });
  };

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
      <TitleForPage titleText="حذف الدورات" />
      {isLoading && <Loader />}

      {coursesData?.length ? (
        <div className="container grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 relative z-10">
          {coursesData?.map((course) => {
            return (
              <Card key={course.id} className="py-4 rounded-xl max-w-[500px] ">
                <CardHeader className="flex-col items-start">
                  <p className={`text-2xl font-bold text-orange-600`}>{course.courseName}</p>
                  <h4 className={`text-xl font-bold`}>{course.courseSubName}</h4>
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

                <CardFooter className="grid gap-2">
                  <Button fullWidth variant="ghost" color="primary" size="lg" className="text-xl font-bold h-fit p-5" href={`/our-courses/${course.id}?courseName=${course.courseName}`} as={Link}>
                    الذهاب للدورة
                  </Button>
                  <Button
                    onClick={() => {
                      alert(course.id);
                    }}
                    fullWidth
                    variant="shadow"
                    color="danger"
                    size="lg"
                    className="text-xl font-bold h-fit p-5"
                  >
                    حذف
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty urlForBtn="/mangement/our-courses/add" textForBtn="إضافة دورات" />
      )}
    </div>
  );
};

export default DeleteCourse;
