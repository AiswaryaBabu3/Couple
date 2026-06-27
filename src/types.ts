export type QuestionType =
  | 'text'
  | 'date'
  | 'choice'
  | 'would-you-rather'
  | 'potato'
  | 'emoji'
  | 'cutest';

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  successMessage?: string;
  debtType?: 'chocolate' | 'pizza' | 'love';
  skipGrading?: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, string>;
  quizCompleted: boolean;
}
