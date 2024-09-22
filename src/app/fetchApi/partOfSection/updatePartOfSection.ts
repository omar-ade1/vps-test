import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

interface InputValues {
  title?: string;
  details?: string;
}

export const UPDATE_PART_OF_SECTION_IN_COURSE = async (inputsValues: InputValues, idOfCourse: string, sectionId: string, partOfSectionId: number) => {
  try {
    const res = await axios.put(`${DOMAIN_NAME}/api/partOfSection/${partOfSectionId}?courseId=${idOfCourse}&sectionId=${sectionId}`, {
      title: inputsValues.title,
      details  : inputsValues.details
    });
    return res;
  } catch (error) {
    return error;
  }
};
