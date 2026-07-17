export interface Question {
  id: string;
  text: string;
  expectedAnswer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string;
  questionSetId: string;
}

export interface QuestionSet {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  userId: string;
  createdAt: Date;
}
