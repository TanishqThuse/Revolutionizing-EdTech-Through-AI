import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { generatePracticeProblems } from '../services/practice';
import type { PracticeProblem } from '../types/practice';

interface PracticeProblemsProps {
  currentProblem: string;
}

export const PracticeProblems: React.FC<PracticeProblemsProps> = ({ currentProblem }) => {
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const handleGenerateProblems = async () => {
    setLoading(true);
    try {
      const newProblems = await generatePracticeProblems(currentProblem);
      setProblems(newProblems);
      setUserAnswers({});
      setShowExplanation({});
    } catch (error) {
      console.error('Error generating practice problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = (problemId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [problemId]: answer
    }));
  };

  const toggleExplanation = (problemId: string) => {
    setShowExplanation(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Practice Problems</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateProblems}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Generate New Problems
        </motion.button>
      </div>

      <div className="space-y-4">
        {problems.map((problem) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white rounded-lg shadow-md"
          >
            <p className="text-lg mb-3">{problem.question}</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Your answer"
                value={userAnswers[problem.id] || ''}
                onChange={(e) => handleAnswerSubmit(problem.id, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {userAnswers[problem.id] && (
                <div className="flex items-center">
                  {userAnswers[problem.id] === problem.answer ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
              )}
            </div>

            {userAnswers[problem.id] && userAnswers[problem.id] !== problem.answer && (
              <div className="mt-3">
                <button
                  onClick={() => toggleExplanation(problem.id)}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                >
                  {showExplanation[problem.id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {showExplanation[problem.id] ? 'Hide Solution' : 'Show Solution'}
                </button>
                
                {showExplanation[problem.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-3 bg-purple-50 rounded-lg"
                  >
                    <p className="font-medium text-purple-800">Correct Answer: {problem.answer}</p>
                    <p className="mt-2 text-gray-700">{problem.explanation}</p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};