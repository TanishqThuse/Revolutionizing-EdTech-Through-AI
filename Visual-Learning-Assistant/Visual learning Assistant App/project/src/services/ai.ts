import { geminiApi, geminiConfig } from './gemini-config';
import { processImage } from './image-utils';

export async function analyzeProblem(input: string): Promise<{ fullResponse: string; speechResponse: string }> {
  try {
    const model = geminiApi.getGenerativeModel({
      model: geminiConfig.model,
      generationConfig: geminiConfig.generationConfig,
    });

    if (!model) {
      throw new Error("Failed to retrieve the generative model.");
    }

    const isBase64Image = input.startsWith('data:image');
    
    let contents;
    if (isBase64Image) {
      const imageData = await processImage(input);
      contents = [{
        role: 'user',
        parts: [
          { text: "You are a helpful tutor. Please analyze this problem and provide a detailed step-by-step solution. Make your explanation clear and educational. Also provide a short, direct final answer that can be spoken." },
          { inlineData: { data: imageData, mimeType: 'image/jpeg' } }
        ]
      }];
    } else {
      contents = [{
        role: 'user',
        parts: [
          { text: `Please solve this problem step by step and provide a short, direct final answer at the end prefixed with SPEECH_RESPONSE:. Problem: ${input}` }
        ]
      }];
    }

    const result = await model.generateContent({ contents });
    if (!result || !result.response) {
      throw new Error("No response from the model.");
    }

    const responseText = await result.response.text();
    if (!responseText) {
      throw new Error("Empty response from the model.");
    }

    // Extract speech response if present
    const speechMatch = responseText.match(/SPEECH_RESPONSE:\s*(.+?)(?:\n|$)/);
    const speechResponse = speechMatch ? speechMatch[1].trim() : "The answer is " + responseText.split('\n').pop()?.trim();

    return {
      fullResponse: responseText.replace(/SPEECH_RESPONSE:.+?(?:\n|$)/, '').trim(),
      speechResponse
    };
  } catch (error) {
    console.error("Error analyzing problem:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      fullResponse: `Sorry, there was an error: ${errorMessage}. Please try again.`,
      speechResponse: "Sorry, there was an error. Please try again."
    };
  }
}