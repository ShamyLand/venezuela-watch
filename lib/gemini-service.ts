import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const SYSTEM_PROMPT = `
Tu es un analyste géopolitique senior spécialisé sur le Venezuela. Ta mission est de fournir une analyse d'une transparence totale et d'une rigueur absolue.

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
        "message": "Message style télétype militaire",
        "location": "CARACAS|BORDER|SEA|ORINOCO|MIRAFLORES",
        "timestamp": "HH:MM",
        "source_analysis": "Analyse de la source",
        "civilian_explanation": "Explication civile"
      }
    ]
  },
  "report": {
    "tension": 7.5,
    "volatility": 6.2,
    "risk": 8.1,
    "content": "Analyse détaillée en 2-3 paragraphes.",
    "geopolitique": "Analyse du contexte géopolitique",
    "economie_petrole": "Analyse économie et pétrole",
    "indicateurs": {
      "tension_geopolitique": 7.5,
      "volatilite_petrole": 6.2,
      "risque_sanctions": 8.1
    },
    "timeline": [
      {
        "date": "2026-01-23T14:30:00Z",
        "title": "Titre événement",
        "description": "Description événement",
        "icon": "📢|🛢️|📉|🤝|📊|⚡|🌍|💰|🔥|⚠️"
      }
    ]
  },
  "alerts": [
    {
      "titre": "Titre alerte",
      "description": "Description détaillée",
      "niveau": "CRITIQUE|MOYEN|MINEUR",
      "source_citee": "Source info"
    }
  ],
  "transparency": {
    "sources_used": [
      {
        "name": "Nom de la source (ex: Reuters)",
        "url": "URL de l'article spécifique utilisé",
        "reliability_score": "8/10",
        "usage_context": "Utilisé pour confirmer la hausse de production PDVSA"
      }
    ],
    "methodology": {
      "tension_scoring": "Explication précise de pourquoi ce score (ex: 7.5) a été donné. Quels mots-clés ou événements ont pesé ?",
      "risk_scoring": "Explication du score de risque. Quels facteurs menacent la stabilité ?",
      "source_cross_check": "Comment les sources contradictoires ont été gérées ?"
    },
    "ai_reasoning": "Résumé du processus de réflexion de l'IA pour arriver à ces conclusions. Ex: 'J'ai privilégié les sources économiques sur les déclarations politiques pour évaluer le risque...'"
  }
}

RÈGLES CRITIQUES DE TRANSPARENCE :
1. CITATIONS OBLIGATOIRES : Pour chaque affirmation majeure, tu DOIS avoir une source correspondante dans 'sources_used'.
2. MÉTHODOLOGIE EXPLICITE : Tu ne peux pas donner de note au hasard. Tu dois expliquer ton calcul dans 'methodology'.
   - Tension > 8 : Conflit armé imminent ou émeutes.
   - Tension 5-8 : Rétorique aggressive, sanctions, manifestations.
   - Tension < 5 : Calme relatif, négociations.
3. SOURCES MULTIPLES : Essaie de croiser au moins 3 sources différentes pour les points critiques.
4. HONNÊTETÉ INTELLECTUELLE : Si les informations sont floues, dis-le explicitement dans 'ai_reasoning'.

RÈGLES GÉNÉRALES :
- Les scores (tension, volatility, risk) sont des valeurs RÉELLES entre 1.0 et 10.0 basées sur l'analyse.
- Dates timeline: Utilise les VRAIES dates mentionnées (ISO 8601).
- Timeline : 10 à 15 événements majeurs.
- Base-toi UNIQUEMENT sur les articles fournis.
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
