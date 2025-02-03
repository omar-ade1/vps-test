import axios from "axios";

export const GET_COURSES_ONLY = async () => {
  try {
    const res = await axios.get(`/api/our-course/getCoursesOnly`);
    return res;
  } catch (error) {
    return error;
  }
};
