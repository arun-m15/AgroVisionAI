// js/gemini-api.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your Gemini API Key
const API_KEY = "AIzaSyBW3wpHQD-KLrKn9xrcN2tSmCZuRQ1uEI4";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function askAgroGPT(userPrompt) {
  const agriculturePrompt = `
You are AgroGPT 🌾, a helpful assistant that only answers agriculture-related questions.
If a question is unrelated to agriculture (e.g., finance, movies, etc.), respond with:
"I'm designed to help only with agriculture-related queries 🌱."
User's question: ${userPrompt}
Answer:
`;

  const result = await model.generateContent(agriculturePrompt);
  const response = await result.response;
  return response.text();
}
