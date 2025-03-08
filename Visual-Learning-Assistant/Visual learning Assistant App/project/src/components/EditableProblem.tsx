import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check } from 'lucide-react';

interface EditableProblemProps {
  initialProblem: string;
  onProblemChange: (newProblem: string) => void;
}

export const EditableProblem: React.FC<EditableProblemProps> = ({
  initialProblem,
  onProblemChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [problem, setProblem] = useState(initialProblem);

  useEffect(() => {
    setProblem(initialProblem);
  }, [initialProblem]);

  const handleSubmit = () => {
    setIsEditing(false);
    onProblemChange(problem);
  };

  return (
    <div className="relative p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="flex-1 p-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="p-2 bg-purple-600 text-white rounded-md"
          >
            <Check className="w-5 h-5" />
          </motion.button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-gray-800">{problem}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="p-2 text-purple-600 hover:text-purple-700"
          >
            <Edit2 className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </div>
  );
}