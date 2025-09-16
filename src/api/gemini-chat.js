import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY =  "AIzaSyCBFC_V_C6aoRYnUSDXzkINiymODoGGBJU";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function getGeminiResponse(message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash:generateContent" });
    const result = await model.generateContent(`You are a helpful assistant specialized in disaster and emergency preparedness. Answer the following question:\n${message}`);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I am having trouble connecting to the AI service.";
  }
}
