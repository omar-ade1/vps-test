import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const DELETE_SECTION_IN_COURSE = async (idOfCourse: number, sectionId: number) => {
  try {
    const res = await axios.delete(`${DOMAIN_NAME}/api/addSectionInCourse/${sectionId}?courseId=${idOfCourse}`);
    return res;
  } catch (error) {
    return error;
  }
};
