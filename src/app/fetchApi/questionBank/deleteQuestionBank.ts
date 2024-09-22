import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const DELETE_QUESTION_BANK = async (idOfQuestionBank: number) => {
  try {
    const res = await axios.delete(`${DOMAIN_NAME}/api/questionBank/${idOfQuestionBank}`);
    return res;
  } catch (error) {
    return error;
  }
};
