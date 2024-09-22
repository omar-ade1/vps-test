import axios from "axios";

export const SEND_NEW_REQUEST = async (courseId: string) => {
  try {
    const res = await axios.post(`/api/requestCourse?courseId=${courseId}`);
    return res;
  } catch (error) {
    return error;
  }
};
