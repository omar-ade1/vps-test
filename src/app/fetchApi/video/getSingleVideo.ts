import axios from "axios";

export const GET_SINGLE_VIDEO = async (videoId: string) => {
  try {
    const res = await axios.get(`/api/video/${videoId}`);
    return res;
  } catch (error) {
    return error;
  }
};
