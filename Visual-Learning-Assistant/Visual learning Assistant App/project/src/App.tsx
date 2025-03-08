import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, GraduationCap } from 'lucide-react';
import { Camera } from './components/Camera';
import { Solution } from './components/Solution';
import { VoiceInput } from './components/VoiceInput';
import { EditableProblem } from './components/EditableProblem';
import { PracticeProblems } from './components/PracticeProblems';
import { ShareSolution } from './components/ShareSolution';
import { QuestionHistory } from './components/QuestionHistory';
import { useQuestionHistory } from './hooks/useQuestionHistory';
import { analyzeProblem } from './services/ai';
import { SpeechService } from './services/speech';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [solution, setSolution] = useState('');
  const [currentProblem, setCurrentProblem] = useState('');
  const [speechService] = useState(() => new SpeechService());
  const { history, addQuestion, clearHistory } = useQuestionHistory();

  const handleCapture = async (image: string) => {
    setIsProcessing(true);
    try {
      const result = await analyzeProblem(image);
      setSolution(result.fullResponse);
      setCurrentProblem(result.fullResponse.split('\n')[0]);
      speechService.speak(result.speechResponse);
      addQuestion('Image captured problem', result.fullResponse);
    } catch (error) {
      console.error('Error:', error);
      setSolution('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      console.log("Voice input received:", text);
      const result = await analyzeProblem(text);
      setSolution(result.fullResponse);
      setCurrentProblem(text);
      speechService.speak(result.speechResponse);
      addQuestion(text, result.fullResponse);
    } catch (error) {
      console.error('Error:', error);
      setSolution('Sorry, there was an error processing your voice input. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [speechService, addQuestion]);

  const handleProblemEdit = useCallback(async (newProblem: string) => {
    setIsProcessing(true);
    try {
      const result = await analyzeProblem(newProblem);
      setSolution(result.fullResponse);
      setCurrentProblem(newProblem);
      speechService.speak(result.speechResponse);
      addQuestion(newProblem, result.fullResponse);
    } catch (error) {
      console.error('Error:', error);
      setSolution('Sorry, there was an error processing your edited problem. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [speechService, addQuestion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Existing header and components */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-purple-600" />
            <GraduationCap className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Visual Learning Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Point your camera at any problem, speak, or type to get step-by-step solutions
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Existing components */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="flex-1">
              <Camera onCapture={handleCapture} isProcessing={isProcessing} />
            </div>
            <VoiceInput onVoiceInput={handleVoiceInput} />
          </motion.div>

          {currentProblem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <EditableProblem
                initialProblem={currentProblem}
                onProblemChange={handleProblemEdit}
              />
            </motion.div>
          )}

          {solution && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Solution solution={solution} isLoading={isProcessing} />
                <div className="mt-4">
                  <ShareSolution problem={currentProblem} solution={solution} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <PracticeProblems currentProblem={currentProblem} />
              </motion.div>
            </>
          )}

          {/* Question History */}
          <QuestionHistory history={history} onClear={clearHistory} />
        </div>
      </div>
    </div>
  );
}

export default App;