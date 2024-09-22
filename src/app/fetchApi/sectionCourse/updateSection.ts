import axios from "axios";

interface inputsValues {
  title?: string;
  details?: string;
}

export const UPDATE_SECTION_IN_COURSE = async (inputsValues: inputsValues, idOfCourse: number, sectionId: number) => {
  try {
    
    const res = await axios.put(`/api/addSectionInCourse/${sectionId}?courseId=${idOfCourse}`, {
      title: inputsValues.title,
      details: inputsValues.details,
    });
    return res;
  } catch (error) {
    return error;
  }
};
