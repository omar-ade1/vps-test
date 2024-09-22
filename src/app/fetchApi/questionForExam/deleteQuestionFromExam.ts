import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const DELETE_QUESTION_FROM_EXAM = async (idOfCourse: string, testId: string, questionId: number) => {
  try {
    const res = await axios.put(`${DOMAIN_NAME}/api/questionForExam/${questionId}?courseId=${idOfCourse}&testId=${testId}&deleteOrUpdate=delete`);
    return res;
  } catch (error) {
    return error;
  }
};
