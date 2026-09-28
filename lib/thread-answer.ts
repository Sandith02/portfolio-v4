export const ANSWER_WORD_LIMIT = 500;
export const ANSWER_CHARACTER_LIMIT = 20000;
export function answerWordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}
export function answerError(value: string) {
  if (!value.trim()) return "Write your answer first.";
  if (answerWordCount(value) > ANSWER_WORD_LIMIT) return "Keep your answer within 500 words.";
  if (value.length > ANSWER_CHARACTER_LIMIT) return "Your answer is too long. Please shorten it a little.";
  return "";
}
