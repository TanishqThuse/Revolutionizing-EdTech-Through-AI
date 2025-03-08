import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Check } from 'lucide-react';
import { generatePDF, shareSolution } from '../services/share';

interface ShareSolutionProps {
  problem: string;
  solution: string;
}

export const ShareSolution: React.FC<ShareSolutionProps> = ({ problem, solution }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveAsPDF = async () => {
    try {
      await generatePDF(problem, solution);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      await shareSolution(problem, solution);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error sharing solution:', error);
      alert('Failed to share solution. The solution has been copied to your clipboard instead.');
    }
  };

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSaveAsPDF}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        {showSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        Save as PDF
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        {showSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        Share
      </motion.button>
    </div>
  );
};