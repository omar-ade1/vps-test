import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const DELETE_OUR_COURSE = async (id: string) => {
  try {
    const res = await axios.delete(`${DOMAIN_NAME}/api/our-course/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};
