import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const DELETE_PART_OF_SECTION_IN_COURSE = async (idOfCourse: string, sectionId: string, partOfSectionId: number) => {
  try {
    const res = await axios.delete(`${DOMAIN_NAME}/api/partOfSection/${partOfSectionId}?courseId=${idOfCourse}&sectionId=${sectionId}`);
    return res;
  } catch (error) {
    return error;
  }
};
