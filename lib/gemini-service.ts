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
    "tendance_label": "Phrase courte expliquant la tendance",
    "intel_feed": [
      {
        "type": "SIGINT|HUMINT|SAT|OSINT|CYBER",
        "message": "Message court style télétype militaire (ex: MOUVEMENTS TROUPES FRONT. COLOMBIE)",
        "location": "CARACAS|BORDER|SEA|ORINOCO|MIRAFLORES",
        "timestamp": "HH:MM",
        "source_analysis": "Explique brièvement sur quelle donnée réelle tu te bases (ex: 'Basé sur la hausse brutale du WTI + rumeurs Twitter')",
        "civilian_explanation": "Traduction en langage civil (ex: 'Préparation probable d'une action militaire ou renforcement de sécurité')"
      },
      { "type": "SAT", "message": "...", "location": "...", "timestamp": "...", "source_analysis": "...", "civilian_explanation": "..." },
      { "type": "HUMINT", "message": "...", "location": "...", "timestamp": "...", "source_analysis": "...", "civilian_explanation": "..." }
    ]
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
        "icon": "📢|🛢️|📉|🤝|📊|⚡|🌍|💰|🔥|⚠️"
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

RÈGLES CRITIQUES :
- Les scores (tension, volatility, risk) sont des EXEMPLES - Tu DOIS générer des valeurs RÉELLES entre 1.0 et 10.0 basées sur l'analyse des articles
- Les scores doivent refléter la vraie situation géopolitique actuelle du Venezuela
- Dates timeline: Utilise les VRAIES dates mentionnées dans les articles (format ISO 8601)
- Timeline : Extrais 10 à 15 événements majeurs avec leurs dates EXACTES
- Icônes timeline : 📢🛢️📉🤝📊⚡🌍💰🔥⚠️
- Base-toi UNIQUEMENT sur les articles fournis
`;

export async function generateAnalysis(newsContext: string) {
  try {
    console.log("🤖 Initializing Gemini model: gemini-3-flash-preview");

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    console.log("📡 Sending request to Gemini API...");
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      `Voici les dernières actualités à analyser :\n${newsContext}\n\nDate actuelle : ${new Date().toISOString()}`
    ]);

    const response = await result.response;
    let text = response.text();

    console.log("✅ Raw Gemini Output received:", text.substring(0, 200));

    // CLEANUP: Remove markdown code blocks if present (even with JSON mode, it happens)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);
    console.log("✅ JSON parsed successfully");
    return parsed;
  } catch (error) {
    console.error("❌ Gemini Analysis Failed:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}
