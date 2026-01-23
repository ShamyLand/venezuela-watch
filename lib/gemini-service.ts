import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const SYSTEM_PROMPT = `
Tu es un analyste géopolitique senior spécialisé Venezuela.

Analyse les articles fournis et génère un JSON complet en FRANÇAIS avec cette structure EXACTE:

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
    "content": "Analyse détaillée en 2-3 paragraphes couvrant la situation géopolitique, économique et pétrolière.",
    "geopolitique": "Analyse du contexte géopolitique",
    "economie_petrole": "Analyse de l'économie et du marché pétrolier",
    "indicateurs": {
      "tension_geopolitique": 7.5,
      "volatilite_petrole": 6.2,
      "risque_sanctions": 8.1
    },
    "timeline": [
      {
        "date": "2026-01-23T14:30:00Z",
        "title": "Titre court de l'événement",
        "description": "Description courte",
        "icon": "📢|🛢️|📉|🤝|📊"
      }
    ]
  },
  "alerts": [
    {
      "titre": "Titre de l'alerte",
      "description": "Description détaillée",
      "niveau": "CRITIQUE|MOYEN|MINEUR",
      "source_citee": "Source de l'information"
    }
  ]
}

RÈGLES :
- Scores entre 1.0 et 10.0
- Base-toi UNIQUEMENT sur les articles fournis
- Dates timeline au format ISO 8601
- Timeline : Extrais 5 à 8 événements majeurs des articles
- Icônes timeline : Choisis l'icône la plus pertinente
`;

export async function generateAnalysis(newsContext: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      `Voici les dernières actualités à analyser :\n${newsContext}\n\nDate actuelle : ${new Date().toISOString()}`
    ]);

    const response = await result.response;
    let text = response.text();

    console.log("Raw Gemini Output:", text);

    // CLEANUP: Remove markdown code blocks if present (even with JSON mode, it happens)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return null;
  }
}
