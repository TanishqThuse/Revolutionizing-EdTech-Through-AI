import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface SolutionProps {
  solution: string;
  isLoading: boolean;
}

export const Solution: React.FC<SolutionProps> = ({ solution, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-6 bg-white rounded-lg shadow-xl">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white/50 backdrop-blur-sm rounded-lg shadow-xl">
        <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
        <p className="text-gray-600 text-center">
          Capture a problem to get started. I'll help you solve it step by step.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-purple max-w-none p-6 bg-white rounded-lg shadow-xl"
    >
      <ReactMarkdown>{solution}</ReactMarkdown>
    </motion.div>
  );
};