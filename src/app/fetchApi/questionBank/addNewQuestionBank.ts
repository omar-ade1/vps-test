import axios from "axios";

export const ADD_NEW_QUESTION_BANK = async (name: string) => {
  try {
    const res = await axios.post(`/api/questionBank`, {
      name: name,
    });
    return res;
  } catch (error) {
    return error;
  }
};
