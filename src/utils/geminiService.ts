import { GoogleGenerativeAI } from "@google/generative-ai";

// In Vite/React, use VITE_GEMINI_API_KEY for frontend access
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

console.log('Gemini API key status:', apiKey ? 'Found' : 'Missing');

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function askGemini(prompt: string): Promise<string> {
  if (!apiKey) {
    throw new Error("Gemini API key not set. Please add VITE_GEMINI_API_KEY to your .env file.");
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Example: Use this function in your app
// const answer = await askGemini("What crop is best for clay soil in Kharif season?");
