import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const GET_ALL_COURSES = async () => {
  try {
    const res = await axios.get(`${DOMAIN_NAME}/api/our-course`);
    return res;
  } catch (error) {
    return error;
  }
};
