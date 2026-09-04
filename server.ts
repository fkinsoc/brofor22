import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Route using Gemini
  app.post("/api/ai/generate", async (req, res) => {
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

      res.json({ text: response.text || "" });
    } catch (error: any) {
      console.error("Gemini AI Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });

  // AI Chat Route using Gemini
  app.post("/api/ai/chat", async (req, res) => {
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

      res.json({ text: response.text || "" });
    } catch (error: any) {
      console.error("Gemini AI Chat Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI chat response" });
    }
  });

  // Maps Config Route
  app.get("/api/config/maps", (req, res) => {
    const key = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "";
    res.json({ apiKey: key });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
