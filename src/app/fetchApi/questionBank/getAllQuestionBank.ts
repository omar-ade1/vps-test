import axios from "axios";

export const GET_QUESTION_BANK = async () => {
  try {
    const res = await axios.get(`/api/questionBank`);
    return res;
  } catch (error) {
    return error;
  }
};
