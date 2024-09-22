import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const GET_ALL_RESULT_OF_ONE_EXAM_ALL_USER = async (idOfCourse: string, testId: string) => {
  try {
    const res = await axios.get(`${DOMAIN_NAME}/api/allResultOfOneExamAllUser?courseId=${idOfCourse}&testId=${testId}`);
    return res;
  } catch (error) {
    return error;
  }
};
