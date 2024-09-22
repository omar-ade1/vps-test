import axios from "axios";


interface InputsValues {
  questionText: string;
  questionsBankId: number;
  questionSection?: string;
  answer1?: string;
  answer2?: string;
  answer3?: string;
  answer4?: string;
  answerTrue: number;
}

export const ADD_QUESTION_FOR_EXAM = async (inputsValues: InputsValues, idOfCourse: string, testId: string) => {
  try {
    const res = await axios.post(`/api/questionForExam?courseId=${idOfCourse}&testId=${testId}`, {
      questionText: inputsValues.questionText,
      questionBankId: inputsValues.questionsBankId,
      questionSection: inputsValues.questionSection,
      answer1: inputsValues.answer1,
      answer2: inputsValues.answer2,
      answer3: inputsValues.answer3,
      answer4: inputsValues.answer4,
      answerTrue: inputsValues.answerTrue,
    });
    return res;
  } catch (error) {
    return error;
  }
};
