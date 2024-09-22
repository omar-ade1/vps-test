import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const GET_QUESTION_BANK = async () => {
  try {
    const res = await axios.get(`${DOMAIN_NAME}/api/questionBank`);
    return res;
  } catch (error) {
    return error;
  }
};
