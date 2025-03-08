import { useState, useCallback } from 'react';
import type { QuestionHistory } from '../types/history';

export function useQuestionHistory() {
  const [history, setHistory] = useState<QuestionHistory[]>([]);

  const addQuestion = useCallback((question: string, solution?: string) => {
    setHistory(prev => [
      {
        id: crypto.randomUUID(),
        question,
        solution,
        timestamp: Date.now()
      },
      ...prev
    ]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addQuestion, clearHistory };
}