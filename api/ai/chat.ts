import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  try {
    const { messages, systemInstruction, useSearch, modelType } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const formattedContents = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    // Map modelType to appropriate model string
    let model = "gemini-3.5-flash";
    if (modelType === "fast") model = "gemini-3.1-flash-lite";
    if (modelType === "complex") model = "gemini-3.1-pro-preview";
    // Google search grounding works well with 3.5-flash
    if (useSearch) model = "gemini-3.5-flash";

    const config: any = {
      systemInstruction: systemInstruction || "You are a helpful assistant.",
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model,
      contents: formattedContents,
      config
    });

    res.status(200).json({ text: response.text || "" });
  } catch (error: any) {
    console.error("Gemini AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI chat response" });
  }
}
