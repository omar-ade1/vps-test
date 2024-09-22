import axios from "axios";

export const DELETE_QUESTION_BANK = async (idOfQuestionBank: number) => {
  try {
    const res = await axios.delete(`/api/questionBank/${idOfQuestionBank}`);
    return res;
  } catch (error) {
    return error;
  }
};
