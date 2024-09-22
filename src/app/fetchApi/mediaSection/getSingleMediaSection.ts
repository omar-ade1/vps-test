import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const GET_SINGLE_MEDIA_SECTION = async (idOfCourse: string, sectionId: string, partOfSectionId: string, type: string, mediaSectionId: string) => {
  try {
    const res = await axios.get(
      `${DOMAIN_NAME}/api/mediaSection/${mediaSectionId}?courseId=${idOfCourse}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&type=${type}`
    );
    return res;
  } catch (error) {
    return error;
  }
};
