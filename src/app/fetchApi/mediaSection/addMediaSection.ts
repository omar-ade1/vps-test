import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

interface inputsValues {
  title: string;
  details: string;
}

export const ADD_MEDIA_SECTION = async (
  inputsValues: inputsValues,
  type: string,
  idOfCourse: string,
  sectionId: string,
  partOfSectionId: number
) => {
  try {
    const res = await axios.post(`${DOMAIN_NAME}/api/mediaSection?courseId=${idOfCourse}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}`, {
      title: inputsValues.title,
      details: inputsValues.details,
      type: type,
    });
    return res;
  } catch (error) {
    return error;
  }
};
