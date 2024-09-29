import axios from "axios";

interface InputValues {
  title?: string;
  details?: string;
  fullMark?: number;
  allowForStudent?: boolean;
}

export const MOVE_MEDIA_SECTION = async (courseId:string, sectionId:string, partOfSectionId:string, mediaSectionId:number) => {
  try {
    const res = await axios.put(`/api/moveMediaSection?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}`);
    return res;
  } catch (error) {
    return error;
  }
};
