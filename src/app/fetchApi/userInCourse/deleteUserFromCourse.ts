import axios from "axios";

export const DELETE_USER_FROM_COURSE = async (subscriberId: number, courseId: number) => {
  try {
    const res = await axios.delete(`/api/userInCourse/${subscriberId}?courseId=${courseId}`);
    return res;
  } catch (error) {
    return error;
  }
};
