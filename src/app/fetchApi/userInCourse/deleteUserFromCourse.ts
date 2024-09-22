import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const DELETE_USER_FROM_COURSE = async (subscriberId: number, courseId: number) => {
  try {
    const res = await axios.delete(`${DOMAIN_NAME}/api/userInCourse/${subscriberId}?courseId=${courseId}`);
    return res;
  } catch (error) {
    return error;
  }
};
