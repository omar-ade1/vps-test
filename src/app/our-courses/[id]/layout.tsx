"use client";
import React, { useEffect, useState } from "react";
import { GET_SINGLE_COURSE } from "@/app/fetchApi/our-course/getSingleCourse";
import { GET_SINGLE_USER } from "@/app/fetchApi/user/getSingleUser";
import { DOMAIN_NAME } from "@/app/utils/domainName";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { CoruseWithSections } from "@/app/utils/interfaces/ourCourses";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Loader from "@/app/components/Loading/Loader";

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

/**
 * RootLayout is the layout that will be used for all the pages in the application.
 * It is the parent layout for all the pages in the application.
 * @param {any} children - The children of the layout.
 * @param {any} params - The parameters of the layout.
 * @returns {JSX.Element} - The RootLayout component.
 */

export default function RootLayout({ children, params }: { children: any; params: { id: string } }) {
  // course id from params
  const courseId = params.id;
  const router = useRouter();

  // states
  const [courseData, setCourseData] = useState<CoruseWithSections>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState(false);
  const [userData, setUserData] = useState<UserData>();
  const [tokenData, setTokenData] = useState<jwtPayLoad>();

  // get token data from server
  const getTokenData = async () => {
    const message: any = await axios.get(`${DOMAIN_NAME}/api/token`);
    if (message.request.status == 200) {
      setTokenData(message.data.message);
    } else {
      Swal.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
  };

  // run getTokenData when the component mounts
  useEffect(() => {
    getTokenData();
  }, []);

  // get single course data
  const getSingleCourse = async (id: string) => {
    setIsLoading(true);

    // get single course
    const message: any = await GET_SINGLE_COURSE(id);

    // if the request is successful, set the course data
    if (message.request.status == 200) {
      setCourseData(message.data.message);

      // if the request is not successful, show an error message
    } else {
      Swal.fire({
        title: "خطأ",
        text: message.response.data.message,
        icon: "error",
      });
    }

    // set the loading state to false
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // get user data
  const getUserData = async () => {
    setIsLoading(true);

    // if the token data exists, get the user data
    if (tokenData) {
      // get user data
      const message: any = await GET_SINGLE_USER(tokenData.id);

      // if the request is successful, set the user data
      if (message.request.status == 200) {
        setUserData(message.data.message);

        // if the request is not successful, show an error message
      } else {
        Swal.fire({
          title: message.response.data.message,
          icon: "error",
        });
      }
    }

    // set the loading state to false
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // run getSingleCourse when the component mounts and reload state changes
  useEffect(() => {
    getSingleCourse(courseId);
  }, [reload]);

  // run getUserData when the component mounts and tokenData state changes
  useEffect(() => {
    getUserData();
  }, [tokenData]);

  /**
   * Checks if a user is subscribed to a course and handles different scenarios.
   *
   * @returns {null|true|Redirect} null if user is admin, true if user is enrolled,
   * redirects to "userNotCheck" page with "Pending" or "noRequest" status otherwise
   *
   * @dependencies {userData} user data object with enrollment information
   * @dependencies {courseData} course data object with course ID
   * @dependencies {router} router object for redirecting to different pages
   */
  const checkUserSubInCourse = () => {
    // IF USER DATA AND COURSE DATA
    if (userData && courseData) {
      // IF USER IS ADMIN RETURN NULL
      if (userData.isAdmin) {
        return null;
      }

      // "Pending", "Accepted", "Rejected"

      // IF USER HAS COURSE HE SUBSCRIBE IN IT
      if (userData.enrollments.length) {
        const filterCheck = userData.enrollments.filter((enrollment) => enrollment.id === courseData.id);

        if (filterCheck.length) {
          return true;
        }
      }

      // IF USER HAS REQUESTS
      if (userData.EnrollmentRequest.length) {
        const checkFilter = userData.EnrollmentRequest.filter((enrollment) => enrollment.courseId === courseData.id);
        checkFilter.length
          ? router.replace(`/userNotCheck?status=Pending&courseId=${courseData.id}`)
          : router.replace(`/userNotCheck?status=noRequest&courseId=${courseData.id}`);
      }
      // IF USER DOESN'T HAS ANY REQUESTS
      else {
        console.log(true);
        return router.replace(`/userNotCheck?status=noRequest&courseId=${courseData.id}`);
      }

      // USER DATA OR COURSE DATA NOT FOUNDED
    } else {
      console.log(false);
    }
  };


  

  // run checkUserSubInCourse when the component mounts and userData and courseData state changes
  useEffect(() => {
    if (userData?.EnrollmentRequest && courseData?.id) {
      checkUserSubInCourse();
    }
  }, [userData, courseData]);


  return <div>{isLoading ? <Loader /> : <main>{children}</main>}</div>;
}
// >>>>>>> Tabnine >>>>>>>
