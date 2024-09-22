import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const ADD_NEW_QUESTION_BANK = async (name: string) => {
  try {
    const res = await axios.post(`${DOMAIN_NAME}/api/questionBank`, {
      name: name,
    });
    return res;
  } catch (error) {
    return error;
  }
};
