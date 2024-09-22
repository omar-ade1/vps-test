import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const SEND_NEW_REQUEST = async (courseId: string) => {
  try {
    const res = await axios.post(`${DOMAIN_NAME}/api/requestCourse?courseId=${courseId}`);
    return res;
  } catch (error) {
    return error;
  }
};
