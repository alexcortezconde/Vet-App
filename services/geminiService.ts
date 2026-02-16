
import { GoogleGenAI, Type } from "@google/genai";

// Always use the process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getHealthRecommendations(pet: { breed: string; age: number; conditions: string[] }) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 preventive health recommendations for a ${pet.age} year old ${pet.breed} dog. Conditions: ${pet.conditions.join(', ')}. 
      Tone: Helpful, professional, non-alarmist.
      Include a medical disclaimer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['info', 'preventive', 'urgent'] },
                  title: { type: Type.STRING },
                  message: { type: Type.STRING }
                },
                required: ['type', 'title', 'message']
              }
            },
            disclaimer: { type: Type.STRING }
          },
          required: ['recommendations', 'disclaimer']
        }
      }
    });

    // Extract text from the response using the .text property
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}
