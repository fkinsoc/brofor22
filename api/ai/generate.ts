import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  try {
    const { prompt, systemPrompt } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt || "You are a helpful assistant."
      }
    });

    res.status(200).json({ text: response.text || "" });
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
}
