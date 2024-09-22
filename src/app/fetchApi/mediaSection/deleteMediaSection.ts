import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const DELETE_MEDIA_SECTION = async (idOfCourse: string, sectionId: string, partOfSectionId: string, mediaSectionId: string, type: string) => {
  try {
    const res = await axios.delete(
      `${DOMAIN_NAME}/api/mediaSection/${mediaSectionId}?courseId=${idOfCourse}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&type=${type}`
    );
    return res;
  } catch (error) {
    return error;
  }
};
