import { geminiApi, geminiConfig } from './gemini-config';
import type { PracticeProblem } from '../types/practice';

export async function generatePracticeProblems(originalProblem: string): Promise<PracticeProblem[]> {
  try {
    const model = geminiApi.getGenerativeModel({
      model: geminiConfig.model,
      generationConfig: {
        ...geminiConfig.generationConfig,
        temperature: 0.7,
      },
    });

    const prompt = `Based on this problem: "${originalProblem}", generate 3 similar practice problems.
    Format your response EXACTLY like this JSON array, with no additional text or explanation:
    [
      {
        "id": "1",
        "question": "First similar but simpler problem",
        "answer": "The answer",
        "explanation": "Step by step explanation of how to solve this problem"
      },
      {
        "id": "2",
        "question": "Second problem of similar difficulty",
        "answer": "The answer",
        "explanation": "Step by step explanation of how to solve this problem"
      },
      {
        "id": "3",
        "question": "Third more challenging problem",
        "answer": "The answer",
        "explanation": "Step by step explanation of how to solve this problem"
      }
    ]`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    const response = await result.response.text();
    
    // Clean the response to ensure it's valid JSON
    const cleanedResponse = response.trim()
      .replace(/^```json\s*/, '')
      .replace(/\s*```$/, '')
      .replace(/[\u201C\u201D]/g, '"')
      .trim();
    
    try {
      const parsed = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Invalid response format');
      }
      
      // Validate and sanitize each problem
      return parsed.slice(0, 3).map((problem, index) => ({
        id: String(index + 1),
        question: typeof problem.question === 'string' ? problem.question : 'Invalid question',
        answer: typeof problem.answer === 'string' ? problem.answer : 'Invalid answer',
        explanation: typeof problem.explanation === 'string' ? problem.explanation : 'Solution not available'
      }));
    } catch (parseError) {
      console.error('Error parsing practice problems:', parseError);
      // Return default problems if parsing fails
      return [
        {
          id: '1',
          question: 'What is 2 + 3?',
          answer: '5',
          explanation: 'Add the numbers: 2 + 3 = 5'
        },
        {
          id: '2',
          question: 'What is 4 + 6?',
          answer: '10',
          explanation: 'Add the numbers: 4 + 6 = 10'
        },
        {
          id: '3',
          question: 'What is 7 + 8?',
          answer: '15',
          explanation: 'Add the numbers: 7 + 8 = 15'
        }
      ];
    }
  } catch (error) {
    console.error('Error generating practice problems:', error);
    throw new Error('Failed to generate practice problems');
  }
}