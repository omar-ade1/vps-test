import axios from "axios";

interface InputsValues {
  allResult: number;
  wrongeAnswer: number;
  correctAnswer: number;
}

export const ADD_NEW_RESULT_FOR_EXAM = async (inputsValues: InputsValues, idOfCourse: string, testId: string) => {
  try {
    const res = await axios.post(`/api/resultOfExam?courseId=${idOfCourse}&testId=${testId}`, {
      allResult: inputsValues.allResult,
      correctAnswer: inputsValues.correctAnswer,
      wrongAnswer: inputsValues.wrongeAnswer,
    });
    return res;
  } catch (error) {
    return error;
  }
};
