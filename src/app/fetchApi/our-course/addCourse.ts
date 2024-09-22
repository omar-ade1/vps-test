import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

interface inputsValues {
  courseName: string;
  subCourseName: string;
  courseImg: any;
}

export const ADD_COURSE = async (formData:any) => {
  try {

    // استخدم formData مباشرة في طلب Axios
    const res = await axios.post(`${DOMAIN_NAME}/api/our-course`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};
