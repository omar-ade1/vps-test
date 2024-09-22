import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

interface InputValues {
  title?: string;
  details?: string;
  fullMark?: number;
  allowForStudent?: boolean;
}

export const UPDATE_MEDIA_SECTION = async (
  inputsValues: InputValues,
  idOfCourse: string,
  sectionId: string,
  partOfSectionId: string,
  mediaSectionId: string,
  type: string
) => {
  try {
    const res = await axios.put(
      `${DOMAIN_NAME}/api/mediaSection/${mediaSectionId}?courseId=${idOfCourse}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&type=${type}`,
      {
        title: inputsValues.title,
        details: inputsValues.details,
        fullMark: inputsValues.fullMark,
        allowForStudent: inputsValues.allowForStudent,
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};
