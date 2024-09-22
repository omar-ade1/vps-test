import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const GET_SINGLE_VIDEO = async (videoId: string) => {
  try {
    const res = await axios.get(`${DOMAIN_NAME}/api/video/${videoId}`);
    return res;
  } catch (error) {
    return error;
  }
};
