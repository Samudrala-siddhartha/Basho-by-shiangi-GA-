import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PRODUCTS, WORKSHOPS } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Gemini 3 Pro Preview for complex reasoning and multimodal tasks
const CHAT_MODEL = "gemini-3-pro-preview";
const VISION_MODEL = "gemini-3-pro-preview";

const SYSTEM_INSTRUCTION = `
You are 'Basho', a helpful and poetic AI assistant for a pottery studio called "Basho by Shivangi".
The brand essence is Wabi-sabi, Japanese minimalism, earthy, and raw.
Your tone should be calm, wise, slightly poetic, but practical when asked about prices or booking.

Here is the current product inventory:
${JSON.stringify(PRODUCTS.map(p => `${p.name} (${p.category}): ₹${p.price} - ${p.description}`))}

Here are upcoming workshops:
${JSON.stringify(WORKSHOPS.map(w => `${w.title}: ${w.date} - ₹${w.price}`))}

If a user asks for recommendations, suggest items based on the "vibe" they describe.
If they ask about custom orders, encourage them to use the Custom Order page.
Keep responses concise (under 50 words) unless telling a story.
`;

export const sendMessageToBasho = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: CHAT_MODEL,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history,
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "The kiln is too hot, I cannot think right now. (Error)";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I apologize, my connection to the spirit of the clay is interrupted. Please try again.";
  }
};

export const generatePoeticDescription = async (userRequest: string, imageBase64?: string, mimeType?: string): Promise<string> => {
  try {
    const promptText = `
      A user wants a custom piece of pottery.
      User description: "${userRequest}"
      ${imageBase64 ? "The user has also provided a visual reference image." : ""}
      
      Please analyze the request (and the image if provided) and generate a response in JSON format with two fields:
      1. "haiku": A haiku poem capturing the essence of this request.
      2. "brief": A professional artistic brief for the potter describing the glaze, clay body, form, and firing technique that would achieve this look.
      
      Return ONLY valid JSON.
    `;
    
    const parts: any[] = [];
    
    // Add image part if available
    if (imageBase64 && mimeType) {
        parts.push({
            inlineData: {
                data: imageBase64,
                mimeType: mimeType
            }
        });
    }

    // Add text prompt
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: VISION_MODEL,
      contents: { parts },
      config: {
        responseMimeType: "application/json"
      }
    });

    return response.text || "{}";
  } catch (error) {
    console.error("Gemini Custom Order Error:", error);
    return JSON.stringify({ haiku: "Clay spins on the wheel,\nSilent hands shape the future,\nError in the code.", brief: "Could not generate brief." });
  }
};