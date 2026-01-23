import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
export const SYSTEM_PROMPT = `
Tu es un analyste géopolitique senior spécialisé dans le Venezuela, les relations USA-Amérique latine, et les marchés pétroliers.
Analyse les actualités fournies et génère un JSON en FRANÇAIS avec cette structure EXACTE:
{
  "flash": {
    "content": "Une phrase d'impact de 15-20 mots maximum résumant la situation actuelle du Venezuela",
    "points": [
      "Point clé 1 (15 mots max)",
      "Point clé 2 (15 mots max)",
      "Point clé 3 (15 mots max)",
      "Point clé 4 (15 mots max)",
      "Point clé 5 (15 mots max)"
    ],
    "tendance": "HAUSSIÈRE ou BAISSIÈRE ou STABLE",
    "tendance_label": "Phrase courte de 10 mots expliquant la tendance"
  },
  "report": {
    "tension": 7.5,
    "volatility": 6.2,
    "risk": 8.1,
    "content": "Analyse détaillée en 2-3 paragraphes couvrant la situation géopolitique actuelle, les impacts économiques et pétroliers, et les perspectives à court terme.",
    "geopolitique": "Analyse spécifique du contexte géopolitique",
    "economie_petrole": "Analyse spécifique de l'économie et du marché pétrolier",
    "indicateurs": {
      "tension_geopolitique": 7.5,
      "volatilite_petrole": 6.2,
      "risque_sanctions": 8.1
    }
  },
  "alerts": [
    {
      "title": "Titre court de l'alerte",
      "description": "Description détaillée de l'alerte en 2-3 phrases",
      "niveau": "CRITIQUE ou MOYEN ou MINEUR",
      "titre": "Titre court de l'alerte (duplicate pour compatibilité)",
      "source_citee": "Nom de la source d'information"
    }
  ]
}
RÈGLES CRITIQUES:
- Tous les scores (tension, volatility, risk) doivent être des NOMBRES entre 1.0 et 10.0
- Les clés du JSON sont EN ANGLAIS, les valeurs EN FRANÇAIS
- Basé UNIQUEMENT sur les actualités fournies
- Analyse factuelle et précise, pas de spéculation
- Au moins 2 alertes pertinentes
`;
export async function generateAnalysis(newsContext: string) {
    try {
        // CORRECTION CRITIQUE: gemini-1.5-pro est le modèle correct pour l'API v1beta
        // gemini-pro et gemini-1.5-flash ne sont PAS supportés dans v1beta
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([
            SYSTEM_PROMPT,
            `Voici les dernières nouvelles sur le Venezuela provenant de flux RSS internationaux:\n\n${newsContext}`
        ]);
        const response = await result.response;
        const text = response.text();
        console.log("✅ Gemini Response Received:", text.substring(0, 200));
        // Extract JSON from markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedAnalysis = JSON.parse(jsonStr);
        console.log("✅ Analysis Parsed Successfully");
        return parsedAnalysis;
    } catch (error) {
        console.error("❌ Gemini Analysis Failed:", error);
        if (error instanceof Error) {
            console.error("Error details:", {
                message: error.message,
                stack: error.stack
            });
        }
        return null;
    }
}
