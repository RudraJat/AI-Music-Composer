import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyArw4XO0wRxjiwC6bMaSY3cjinkMTuP9ws");

export async function generateMusicPrompt(params: {
  genre?: string;
  mood?: string;
  tempo?: string;
  duration?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Generate a detailed music composition description based on the following parameters:
      Genre: ${params.genre || 'Any'}
      Mood: ${params.mood || 'Any'}
      Tempo: ${params.tempo || 'Moderate'}
      Duration: ${params.duration || '3 minutes'}
      
      Include specific details about:
      1. Musical structure
      2. Key instruments
      3. Rhythm patterns
      4. Melodic themes`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating music prompt:', error);
    throw error;
  }
}