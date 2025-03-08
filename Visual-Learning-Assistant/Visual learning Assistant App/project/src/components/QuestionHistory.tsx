import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import type { QuestionHistory } from '../types/history';

interface QuestionHistoryProps {
  history: QuestionHistory[];
  onClear: () => void;
}

export const QuestionHistory: React.FC<QuestionHistoryProps> = ({ history, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">Question History</h2>
        </div>
        <button
          onClick={onClear}
          className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="font-medium text-gray-800">{item.question}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};