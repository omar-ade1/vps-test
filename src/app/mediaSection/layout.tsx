"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtPayLoad } from "../utils/interfaces/jwtPayload";
import Swal from "sweetalert2";
import { CoruseWithSections } from "../utils/interfaces/ourCourses";
import { checkUserSubInCourse, getSingleCourse, getTokenData, getUserData } from "../utils/checkIfUserSubInCourse";
import Loader from "../components/Loading/Loader";

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
  const params = useSearchParams();
  const courseId = params.get("courseId");
  const router = useRouter();
  const [courseData, setCourseData] = useState<CoruseWithSections>();
  const [userData, setUserData] = useState<UserData>();
  const [tokenData, setTokenData] = useState<jwtPayLoad>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handelTokenData = async () => {
    setIsLoading(true);
    const data = await getTokenData();
    if (typeof data === "object") {
      setTokenData(data);
    } else {
      Swal.fire({
        title: data,
        icon: "error",
      });
    }
  };

  const handelUserData = async () => {
    setIsLoading(true);
    if (tokenData) {
      const data = await getUserData(tokenData);
      if (typeof data === "object") {
        setUserData(data);
      } else {
        Swal.fire({
          title: data,
          icon: "error",
        });
      }
    }
  };

  const handelCourseData = async () => {
    setIsLoading(true);
    if (courseId) {
      const data = await getSingleCourse(courseId);
      if (typeof data === "object") {
        setCourseData(data);
      } else {
        Swal.fire({
          title: data,
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

  // run checkUserSubInCourse when the component mounts and userData and courseData state changes
  useEffect(() => {
    if (userData?.EnrollmentRequest && courseData?.id) {
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

  return <div className="min-h-[calc(100vh-64px)] py-[50px] relative">{isLoading ? <Loader /> : <main>{children}</main>}</div>;
}
