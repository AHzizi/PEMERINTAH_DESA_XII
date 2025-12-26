export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
}

export interface QuizState {
  currentQuestion: number;
  answers: UserAnswer[];
  timeRemaining: number;
  isCompleted: boolean;
  startTime: number;
}

export interface User {
  firstName: string;
  lastName: string;
}

export interface QuizResult {
  user: User;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: UserAnswer[];
  questions: Question[];
}