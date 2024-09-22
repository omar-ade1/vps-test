export interface Course {
  id: number;
  courseName: string;
  courseSubName: string;
  courseImg: string;
}


export interface SectionOfCourse {
  id: number;
  title: string;
  details: string;
}

export interface CoruseWithSections {
  id: number;
  courseName: string;
  courseSubName: string;
  courseImg: string;
  sections : SectionOfCourse[]
}
