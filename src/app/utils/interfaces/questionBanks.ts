export interface QuestionBank {
  id: number;
  name: string;
  updatedAt: string;
  createdAt: string;
  questions: QuestionInBank[];
}

export interface QuestionInBank {
  id: number;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  answerTrue: number;
  questionText: string;
  questionSection: string;
}
