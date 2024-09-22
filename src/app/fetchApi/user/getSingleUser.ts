import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const GET_SINGLE_USER = async (id: number) => {
  try {
    const res = await axios.get(`${DOMAIN_NAME}/api/user/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};
