import axios from "axios";

export const DELETE_OUR_DEGREE_IMG = async (id: string) => {
  try {
    const res = await axios.delete(`/api/our-degree/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};
