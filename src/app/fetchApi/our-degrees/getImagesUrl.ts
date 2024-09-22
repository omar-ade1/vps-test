import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const GET_OUR_DEGREES_IMAGES_URL = async () => {
  try {
    const res = await axios.get(`${DOMAIN_NAME}/api/our-degree`);
    return res;
  } catch (error) {
    return error;
  }
};
