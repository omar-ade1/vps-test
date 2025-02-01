import axios from "axios";

export const GET_BANKS_WITHOUT_QUESTION = async () => {
  try {
    const res = await axios.get(`/api/questionBank/getBankWithOutQuestion`);
    return res;
  } catch (error) {
    return error;
  }
};
