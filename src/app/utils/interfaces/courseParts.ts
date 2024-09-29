export interface GroupOfSection {
  id: number;
  title: string;
  type: string;
  details: string;
  createdAt: string;
  updatedAt: string;
  partOfSection: string;
  partOfSectionId: number;
  testId: number | null;
  videoId: number | null;
  fileId: number | null;
  noteId: number | null;
}

export interface PartOfSection {
  id: number;
  title: string;
  Section: string;
  sectionId: number;
  details: string;
  createdAt: string;
  updatedAt: string;
  GroupOfSection: GroupOfSection[];
}

export interface SectionData {
  courseId: number;
  id: number;
  details: string;
  title: string;
  partOfSection: PartOfSection[];
}

export interface CoursesData {
  id: number;
  courseName: string;
  courseSubName: string;
  courseImg: string;
  sections: SectionData[];
}
