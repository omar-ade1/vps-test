import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const GET_QUESTION_FOR_EXAM = async (idOfCourse: string, testId: string) => {
  try {
    const res = await axios.get(`${DOMAIN_NAME}/api/questionForExam?courseId=${idOfCourse}&testId=${testId}`);
    return res;
  } catch (error) {
    return error;
  }
};
