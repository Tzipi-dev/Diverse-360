import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
    
  } catch (error: any) {
    console.error("Error generating embedding:", error);
    throw new Error(`Failed to generate embedding: ${error.message || 'Unknown error'}`);
  }
};