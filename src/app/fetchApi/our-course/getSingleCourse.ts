import axios from "axios";

export const GET_SINGLE_COURSE = async (id: string) => {
  try {
    const res = await axios.get(`/api/our-course/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};
