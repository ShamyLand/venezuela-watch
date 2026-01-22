import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const SYSTEM_PROMPT = `
Tu es un analyste géopolitique senior spécialisé Venezuela.

UTILISE GOOGLE SEARCH pour rechercher les actualités récentes sur le Venezuela (48 dernières heures).

Mots-clés à chercher :
- "Venezuela Maduro latest news"
- "PDVSA oil production 2026"
- "Venezuela sanctions USA"
- "Venezuela opposition María Corina Machado"
- "Venezuela economy inflation"

Génère un JSON complet en FRANÇAIS avec cette structure EXACTE:

{
  "news": [
    {
      "title": "Titre en français",
      "title_original": "Titre original (anglais/espagnol)",
      "source": "Reuters/Bloomberg/AP/etc.",
      "url": "URL de l'article original",
      "published_at": "2026-01-23T10:00:00Z",
      "summary": "Résumé en 2 phrases"
    }
    // Au moins 10 articles récents
  ],
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
    }
  },
  "alerts": [
    {
      "title": "Titre de l'alerte",
      "description": "Description détaillée",
      "niveau": "CRITIQUE|MOYEN|MINEUR",
      "url": "URL de la source",
      "source_citee": "Source de l'information"
    }
  ],
  "timeline": [
    {
      "time": "16:45",
      "date": "2026-01-23",
      "icon": "📢",
      "title": "Déclaration Maduro TV",
      "url": "https://...",
      "type": "politique"
    }
    // 5-8 événements récents avec dates et URLs
  ]
}

RÈGLES :
- Scores entre 1.0 et 10.0
- URLs réelles trouvées via Google Search
- Dates au format ISO 8601
- Minimum 10 actualités
- Timeline avec dates précises et liens cliquables
`;

export async function generateAnalysisWithSearch() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Activer Google Search grounding
      generationConfig: {
        temperature: 0.7,
      }
    });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      `Recherche sur Google les dernières actualités sur le Venezuela (48h) et génère une analyse complète. Date actuelle : ${new Date().toISOString()}`
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean code block markers if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analysis with Search Failed:", error);
    return null;
  }
}
