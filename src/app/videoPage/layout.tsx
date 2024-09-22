"use client";
import { cookies } from "next/headers";
import React, { useEffect, useState } from "react";
import { tokenInfo } from "../utils/tokenVerify";
import { jwtPayLoad } from "../utils/interfaces/jwtPayload";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { checkUserSubInCourse, getSingleCourse, getTokenData, getUserData } from "../utils/checkIfUserSubInCourse";
import { CoruseWithSections } from "../utils/interfaces/ourCourses";
import Swal from "sweetalert2";

interface UserData {
  EnrollmentRequest: [
    {
      id: number;
      userId: number;
      courseId: number;
      status: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
  enrollments: [
    {
      id: number;
    }
  ];
  isAdmin: boolean;
}

export default function RootLayout({ children }: any) {
  const [tokenData, setTokenData] = useState<jwtPayLoad>();
  const [courseData, setCourseData] = useState<CoruseWithSections>();
  const [userData, setUserData] = useState<UserData>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const courseId = useSearchParams().get("courseId") as string;

  const handelTokenData = async () => {
    setIsLoading(true);
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

  const handelCourseData = async () => {
    setIsLoading(true);
    if (courseId) {
      const course = await getSingleCourse(courseId);
      if (typeof course === "object") {
        setCourseData(course);
      } else {
        Swal.fire({
          title: course,
          icon: "error",
        });
      }
    }
  };

  const handelUserData = async () => {
    setIsLoading(true);
    if (tokenData) {
      const user = await getUserData(tokenData);
      if (typeof user === "object") {
        setUserData(user);
      } else {
        Swal.fire({
          title: user,
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    handelCourseData();
    handelTokenData();
  }, []);

  useEffect(() => {
    handelUserData();
  }, [tokenData]);

  console.log(userData);
  console.log(courseData);

  // run checkUserSubInCourse when the component mounts and userData and courseData state changes
  useEffect(() => {
    if (userData && courseData?.id) {
      const checking = checkUserSubInCourse(userData, courseData);
      if (checking === "Pending") {
        return router.replace(`/userNotCheck?status=Pending&courseId=${courseData.id}`);
      } else if (checking === "noRequest") {
        return router.replace(`/userNotCheck?status=noRequest&courseId=${courseData.id}`);
      } else {
        setIsLoading(false);
        null;
      }
    }
  }, [userData, courseData]);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
