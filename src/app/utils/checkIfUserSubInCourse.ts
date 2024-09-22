import Swal from "sweetalert2";
import { GET_SINGLE_COURSE } from "../fetchApi/our-course/getSingleCourse";
import { CoruseWithSections } from "./interfaces/ourCourses";
import axios from "axios";
import { DOMAIN_NAME } from "./domainName";
import { jwtPayLoad } from "./interfaces/jwtPayload";
import { GET_SINGLE_USER } from "../fetchApi/user/getSingleUser";

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

// get token data from server
export const getTokenData = async () => {
  const message: any = await axios.get(`${DOMAIN_NAME}/api/token`);
  if (message.request.status == 200) {
    return message.data.message;
  } else {
    return message.response.data.message;
  }
};

export const getSingleCourse = async (courseId: string) => {
  if (courseId) {
    const message: any = await GET_SINGLE_COURSE(courseId);
    if (message.request.status == 200) {
      return message.data.message;
    } else {
      return Swal.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
  }
};

export const getUserData = async (TokenData: jwtPayLoad) => {
  if (TokenData) {
    const message: any = await GET_SINGLE_USER(TokenData.id);
    if (message.request.status == 200) {
      return message.data.message;
    } else {
      return message.response.data.message;
    }
  }
};

export const checkUserSubInCourse = (userData: UserData, courseData: CoruseWithSections) => {
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
      console.log(true);

      if (filterCheck.length) {
        return true;
      }
    }

    // IF USER HAS REQUESTS
    if (userData.EnrollmentRequest.length) {
      const checkFilter = userData.EnrollmentRequest.filter((enrollment) => enrollment.courseId === courseData.id);

      if (checkFilter.length) {
        return "Pending";
      } else {
        return "noRequest";
      }
    }
    // IF USER DOESN'T HAS ANY REQUESTS
    else {
      console.log(true);

      return "noRequest";
    }

    // USER DATA OR COURSE DATA NOT FOUNDED
  } else {
    console.log(false);
  }
};
