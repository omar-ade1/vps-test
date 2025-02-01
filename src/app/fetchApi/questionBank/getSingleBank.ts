import axios from "axios";

export const GET_SINGLE_QUESTION_BANK = async (id: string, numberOfCurrentPage: string) => {
  try {
    const res = await axios.get(`/api/questionBank/${id}?page=${numberOfCurrentPage}`);
    return res;
  } catch (error) {
    return error;
  }
};
