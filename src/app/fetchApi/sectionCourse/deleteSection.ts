import axios from "axios";

export const DELETE_SECTION_IN_COURSE = async (idOfCourse: number, sectionId: number) => {
  try {
    const res = await axios.delete(`/api/addSectionInCourse/${sectionId}?courseId=${idOfCourse}`);
    return res;
  } catch (error) {
    return error;
  }
};
