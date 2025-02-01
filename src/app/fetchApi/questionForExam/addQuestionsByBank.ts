import axios from "axios";

export const ADD_QUESTION_BY_BANK = async (idOfCourse: string, testId: string, questionId: number,questionBankId:number) => {
  try {
    const res = await axios.post(`/api/addQuestionToExamFromBank?questionId=${questionId}&courseId=${idOfCourse}&testId=${testId}&questionBankId=${questionBankId}`);
    return res;
  } catch (error) {
    return error;
  }
};
