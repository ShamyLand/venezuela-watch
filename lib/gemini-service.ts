import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const SYSTEM_PROMPT = `
Tu es un analyste géopolitique senior spécialisé Venezuela, relations USA-Amérique latine, et marchés pétroliers.

Analyse les news fournies et génère en FRANÇAIS un JSON avec cette structure exacte:

{
  "flash": {
    "points": ["... (5 faits marquants max)"],
    "tendance": "HAUSSIÈRE|BAISSIÈRE|STABLE",
    "tendance_label": "... (phrase courte sur la tendance)"
  },
  "rapport": {
    "geopolitique": "... (analyse contexte)",
    "economie_petrole": "... (analyse marché)",
    "indicateurs": {
      "tension_geopolitique": 0-10,
      "volatilite_petrole": 0-10,
      "risque_sanctions": 0-10
    }
  },
  "alertes": [
    {
      "niveau": "CRITIQUE|MOYEN|MINEUR",
      "titre": "...",
      "description": "...",
      "source_citee": "..."
    }
  ]
}

Reste factuel, précis et professionnel. Cite toujours les sources.
`;

export async function generateAnalysis(newsContext: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
            SYSTEM_PROMPT,
            `Voici les dernières nouvelles (Format JSON/Text):\n${newsContext}`
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean code block markers if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        return null;
    }
}
