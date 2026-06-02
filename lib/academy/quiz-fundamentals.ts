export {
  FUNDAMENTALS_BANK,
  FUNDAMENTALS_QUIZ,
  pickQuizQuestions,
  scoreQuestions,
  getQuestionById,
  toPublicQuestion,
} from "./quiz-bank";

import type { QuizQuestion } from "./types";
import { FUNDAMENTALS_QUIZ, scoreQuestions } from "./quiz-bank";

export function scoreQuiz(
  questions: QuizQuestion[],
  answers: Record<string, string>
): number {
  return scoreQuestions(questions, answers);
}

export function quizQuestionIds(questions: QuizQuestion[]): string[] {
  return questions.map((q) => q.id);
}
