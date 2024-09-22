import axios from "axios";

export const DELETE_OUR_COURSE = async (id: string) => {
  try {
    const res = await axios.delete(`/api/our-course/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};
