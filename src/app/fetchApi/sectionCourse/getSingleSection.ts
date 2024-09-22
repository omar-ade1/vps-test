import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const GET_SINGLE_SECTION_IN_COURSE = async (idSection: string, idCourse: string) => {
  try {
    const res = await axios.get(`${DOMAIN_NAME}/api/addSectionInCourse/${idSection}?courseId=${idCourse}`);
    return res;
  } catch (error) {
    return error;
  }
};
