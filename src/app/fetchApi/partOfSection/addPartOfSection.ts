import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

interface inputsValues {
  title: string;
  details: string;
}

export const ADD_PART_OF_SECTION_IN_COURSE = async (inputsValues: inputsValues, idOfCourse: string, sectionId: string) => {
  try {
    const res = await axios.post(`${DOMAIN_NAME}/api/partOfSection?courseId=${idOfCourse}&sectionId=${sectionId}`, {
      title: inputsValues.title,
      details: inputsValues.details,
    });
    return res;
  } catch (error) {
    return error;
  }
};
