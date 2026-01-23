import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const SYSTEM_PROMPT = `
Tu es un analyste géopolitique senior spécialisé Venezuela, relations USA-Amérique latine, et marchés pétroliers.

Analyse les actualités fournies et génère un JSON en FRANÇAIS avec cette structure EXACTE:

{
  "flash": {
    "content": "Une phrase d'impact courte résumant la situation actuelle",
    "points": ["Point clé 1", "Point clé 2", "Point clé 3", "Point clé 4", "Point clé 5"],
    "tendance": "HAUSSIÈRE|BAISSIÈRE|STABLE",
    "tendance_label": "Phrase courte expliquant la tendance"
  },
  "report": {
    "tension": 7.5,
    "volatility": 6.2,
    "risk": 8.1,
    "content": "Analyse détaillée en 2-3 paragraphes couvrant la situation géopolitique, économique et pétrolière. Sois précis et factuel.",
    "geopolitique": "Analyse du contexte géopolitique",
    "economie_petrole": "Analyse de l'économie et du marché pétrolier",
    "indicateurs": {
      "tension_geopolitique": 7.5,
      "volatilite_petrole": 6.2,
      "risque_sanctions": 8.1
    }
  },
  "alerts": [
    {
      "title": "Titre de l'alerte",
      "description": "Description détaillée de l'alerte",
      "niveau": "CRITIQUE|MOYEN|MINEUR",
      "titre": "Titre de l'alerte (duplicate pour compatibilité)",
      "source_citee": "Source de l'information"
    }
  ]
}

RÈGLES IMPORTANTES:
- Les scores (tension, volatility, risk) doivent être des NOMBRES décimaux entre 1.0 et 10.0
- Utilise les clés EN ANGLAIS : "flash", "report", "alerts"
- Les champs "tension", "volatility", "risk" doivent être au premier niveau de "report"
- Sois factuel, précis et professionnel. Cite toujours les sources.
`;

export async function generateAnalysis(newsContext: string) {
  try {
    // UTILISER "gemini-pro" qui est le nom stable dans l'API v1beta
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      `Voici les dernières nouvelles provenant de flux RSS:\n${newsContext}`
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
