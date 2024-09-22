import axios from "axios";

export const GET_ALL_COURSES = async () => {
  try {
    const res = await axios.get(`/api/our-course`);
    return res;
  } catch (error) {
    return error;
  }
};
