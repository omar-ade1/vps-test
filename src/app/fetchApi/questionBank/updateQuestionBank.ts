import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const UPDATE_QUESTION_BANK = async (idOfQuestionBank: number, newName: string) => {
  try {
    const res = await axios.put(`${DOMAIN_NAME}/api/questionBank/${idOfQuestionBank}`, {
      name: newName,
    });
    return res;
  } catch (error) {
    return error;
  }
};
