import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const DELETE_OUR_DEGREE_IMG = async (id: string) => {
  try {
    const res = await axios.delete(`${DOMAIN_NAME}/api/our-degree/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};
