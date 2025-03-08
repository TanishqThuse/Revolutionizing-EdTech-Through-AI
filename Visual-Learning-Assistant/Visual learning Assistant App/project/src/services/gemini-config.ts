import { GoogleGenerativeAI } from '@google/generative-ai';

export const geminiApi = new GoogleGenerativeAI('AIzaSyDs1N-kOfYR40qh1vbGdw3rYAKUc0BsJD0');

export const geminiConfig = {
  model: 'gemini-1.5-flash',
  generationConfig: {
    maxOutputTokens: 1000,
    temperature: 0.4,
  },
};