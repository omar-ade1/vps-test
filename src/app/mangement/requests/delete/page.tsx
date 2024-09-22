"use client";

import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { GET_ALL_COURSES } from "@/app/fetchApi/our-course/getCourses";
import { DELETE_USER_FROM_COURSE } from "@/app/fetchApi/userInCourse/deleteUserFromCourse";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface CoursesData {
  id: number;
  courseName: string;
  courseSubName: string;

  EnrollmentRequest: [
    {
      id: number;
      courseId: number;
      userId: number;
      status: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: number;
        userName: string;
        tel: string;
      };
    }
  ];

  enrolledUsers: [
    {
      id: number;
      userName: string;
      tel: string;
    }
  ];
}

const DeleteSubscription = () => {
  // states
  const [courses, setCourses] = useState<CoursesData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);

  // get all courses data
  const getAllCourses = async () => {
    setIsLoading(true);

    const message: any = await GET_ALL_COURSES();

    // if request is successful, set the course data
    if (message.request.status === 200) {
      setCourses(message.data.message);

      // if the request is not successful, show an error message
    } else {
      Swal.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }

    // set loading to false after 100ms
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // run getAllCourses when the component mounts or reload state changes
  useEffect(() => {
    getAllCourses();
  }, [reload]);

  // alert confirm for accept or reject request
  const alertConfirm = async (id: number, courseId: number) => {
    // show a confirm dialog
    const { value: confirm } = await Swal.fire({
      title: "هل تريد حذف هذا المشترك من هذا الكورس ؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
      cancelButtonText: "لا",
    });
    // if the admin confirms, accept or reject the request
    if (confirm) {
      handelDelete(id, courseId);
    }
  };

  /**
   * Handles the acceptance or rejection of a request.
   *
   * @param {number} id - The ID of the request.
   * @param {number} courseId - The ID of the course.
   * @param {string} status - The status of the request (accept or reject).
   * @return {Promise<void>} A Promise that resolves when the request is handled.
   */
  const handelDelete = async (id: number, courseId: number): Promise<void> => {
    const message: any = await DELETE_USER_FROM_COURSE(id, courseId);

    // If the request is successful (200 status code), display a success message and reload the component.
    if (message.request.status === 200) {
      setReload(!reload);
      Swal.fire({
        title: message.data.message,
        icon: "success",
      });
      // If the request fails, display an error message.
    } else {
      Swal.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
  };

  return (
    <main className="min-h-[calc(100vh-100px)] pt-[50px] pb-[100px] ">
      <TitleForPage titleText="إدارة المشتركين" />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="container">
          {courses
            ? courses.map((course) => {
                return (
                  <div className="my-5 border-2 p-5 shadow-xl" key={course.id}>
                    <h2 className="text-xl font-bold mx-auto text-center">{course.courseName}</h2>
                    <Table className="shadow-xl p-5" key={course.id}>
                      <TableHeader>
                        <TableColumn>اسم المشترك</TableColumn>
                        <TableColumn>تاريخ الطلب</TableColumn>
                        <TableColumn>حذف المشترك</TableColumn>
                      </TableHeader>

                      <TableBody emptyContent={"لا يوجد مشتركين في هذا الكورس"}>
                        {course.enrolledUsers
                          ? course.enrolledUsers.map((e) => (
                              <TableRow key={e.id}>
                                <TableCell>{e.userName}</TableCell>
                                <TableCell>{e.tel}</TableCell>

                                <TableCell>
                                  <Button
                                    onClick={() => {
                                      alertConfirm(e.id, course.id);
                                    }}
                                    color="danger"
                                  >
                                    حذف
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          : []}
                      </TableBody>
                    </Table>
                  </div>
                );
              })
            : ""}
        </div>
      )}
    </main>
  );
};

export default DeleteSubscription;
