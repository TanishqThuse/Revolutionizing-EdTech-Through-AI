import { createSpeechRecognition, createSpeechSynthesis } from '../utils/webSpeech';

export class SpeechService {
  private recognition = createSpeechRecognition();
  private synthesis = createSpeechSynthesis();
  private isListening = false;

  startListening(onResult: (text: string) => void) {
    if (this.isListening) return;
    
    this.recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    this.recognition.start();
    this.isListening = true;
  }

  stopListening() {
    if (!this.isListening) return;
    
    this.recognition.stop();
    this.isListening = false;
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    this.synthesis.speak(utterance);
  }
}