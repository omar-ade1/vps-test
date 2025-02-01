import axios from "axios";

export const DELETE_QUESTION_FROM_QUESTION_BANK = async (questionId: number) => {
  try {
    const res = await axios.delete(`/api/questionBank/question?questionId=${questionId}`);
    return res;
  } catch (error) {
    return error;
  }
};
