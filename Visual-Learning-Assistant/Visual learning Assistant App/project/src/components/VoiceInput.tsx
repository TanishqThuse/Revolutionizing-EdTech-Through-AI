import React, { useCallback, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { SpeechService } from '../services/speech';

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [speechService] = useState(() => new SpeechService());

  const toggleListening = useCallback(() => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.startListening((text) => {
        onVoiceInput(text);
        setIsListening(false);
      });
      setIsListening(true);
    }
  }, [isListening, onVoiceInput, speechService]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleListening}
      className={`p-3 rounded-full ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-purple-600 hover:bg-purple-700'
      } text-white shadow-lg transition-colors`}
    >
      {isListening ? (
        <MicOff className="w-6 h-6 animate-pulse" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </motion.button>
  );
}