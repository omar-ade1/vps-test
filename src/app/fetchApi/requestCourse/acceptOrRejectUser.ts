import axios from "axios";

export const ACCEPT_OR_REJECT_USER_TO_COURSE = async (id: number, courseId: number, status: string) => {
  try {
    const res = await axios.put(`/api/requestCourse/${id}?courseId=${courseId}&status=${status}`);
    return res;
  } catch (error) {
    return error;
  }
};
