import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const PDF_SUMMARY_PROMPT = `
Tu es un analyste géopolitique senior spécialisé Venezuela.

Génère une synthèse COMPLÈTE et PROFESSIONNELLE pour un rapport PDF exécutif en FRANÇAIS.
Cette synthèse doit être structurée, détaillée et adaptée à un format document professionnel.

Structure JSON EXACTE requise:

{
  "titre_rapport": "VENEZUELA WATCH - Synthèse Géopolitique",
  "sous_titre": "Analyse de la situation au [date]",
  "synthese_executive": {
    "resume_general": "Paragraphe de 4-5 phrases résumant la situation globale actuelle au Venezuela",
    "points_cles": [
      "Point stratégique majeur 1",
      "Point stratégique majeur 2",
      "Point stratégique majeur 3",
      "Point stratégique majeur 4",
      "Point stratégique majeur 5"
    ],
    "tendance_generale": "HAUSSIÈRE|BAISSIÈRE|STABLE",
    "evaluation_risque": "ÉLEVÉ|MODÉRÉ|FAIBLE"
  },
  "analyse_geopolitique": {
    "contexte": "2-3 paragraphes analysant le contexte géopolitique actuel, les relations internationales, position des États-Unis, de la Chine, etc.",
    "developpements_recents": "Paragraphe sur les développements des dernières 48-72 heures",
    "implications": "Paragraphe sur les implications pour la région et le monde"
  },
  "analyse_economique": {
    "situation_petrole": "2 paragraphes sur la situation du secteur pétrolier vénézuélien, PDVSA, production, exportations",
    "marche_mondial": "Paragraphe sur l'impact sur le marché mondial du pétrole",
    "sanctions_economiques": "Analyse de l'état des sanctions et leur impact"
  },
  "indicateurs_cles": {
    "tension_geopolitique": 7.5,
    "volatilite_petrole": 6.2,
    "risque_sanctions": 8.1,
    "stabilite_regionale": 5.5,
    "pression_internationale": 7.0
  },
  "timeline_evenements": [
    {
      "date": "2026-01-23T14:30:00Z",
      "titre": "Titre court et descriptif de l'événement",
      "description": "Description en 1-2 phrases de l'événement et son importance",
      "impact": "MAJEUR|MOYEN|MINEUR",
      "categorie": "GEOPOLITIQUE|ECONOMIE|PETROLE|SANCTIONS|DIPLOMATIQUE"
    }
  ],
  "alertes_actives": [
    {
      "titre": "Titre de l'alerte",
      "description": "Description détaillée de la situation alertée",
      "niveau": "CRITIQUE|MOYEN|MINEUR",
      "recommandation": "Recommandation stratégique pour cette alerte"
    }
  ],
  "previsions_court_terme": {
    "7_jours": "Analyse prévisionnelle pour les 7 prochains jours",
    "facteurs_surveillance": [
      "Facteur clé à surveiller 1",
      "Facteur clé à surveiller 2",
      "Facteur clé à surveiller 3"
    ]
  },
  "sources_principales": [
    "Source citée 1",
    "Source citée 2",
    "Source citée 3"
  ]
}

RÈGLES CRITIQUES:
- Les scores doivent être RÉELS basés sur l'analyse (1.0 à 10.0)
- Timeline: Extrais 8-12 événements majeurs avec dates EXACTES des articles
- Utilise un ton professionnel et analytique
- Sois factuel, précis et complet
- Base-toi UNIQUEMENT sur les données fournies
- Dates en format ISO 8601
`;

export async function POST(request: NextRequest) {
  try {
    console.log("📊 Starting PDF summary generation...");

    // 1. Récupérer les données des dernières 48h
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('*')
      .gte('created_at', twoDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (newsError) {
      console.error("❌ Error fetching news:", newsError);
      throw newsError;
    }

    // 2. Récupérer l'analyse la plus récente
    const { data: analysisData, error: analysisError } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (analysisError && analysisError.code !== 'PGRST116') {
      console.error("❌ Error fetching analysis:", analysisError);
    }

    // 3. Récupérer les prix du pétrole
    const { data: oilData, error: oilError } = await supabase
      .from('oil_prices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (oilError && oilError.code !== 'PGRST116') {
      console.error("❌ Error fetching oil prices:", oilError);
    }

    // 4. Préparer le contexte pour Gemini
    const newsContext = newsData?.map((item: any) => {
      return `[${new Date(item.created_at).toLocaleDateString('fr-FR')}] ${item.title}\n${item.description}\nSource: ${item.source}`;
    }).join('\n\n') || 'Aucune actualité récente disponible.';

    // 5. Générer la synthèse avec Gemini
    console.log("🤖 Generating AI summary for PDF...");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent([
      PDF_SUMMARY_PROMPT,
      `Voici les données à analyser:\n\nACTUALITÉS RÉCENTES (48h):\n${newsContext}\n\nPRIX DU PÉTROLE ACTUEL:\nBrent: ${oilData?.brent || 'N/A'} USD\nWTI: ${oilData?.wti || 'N/A'} USD\n\nDate actuelle: ${new Date().toISOString()}`
    ]);

    const response = await result.response;
    let aiSummary = response.text();

    // Nettoyage du JSON
    aiSummary = aiSummary.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedSummary = JSON.parse(aiSummary);

    console.log("✅ AI summary generated successfully");

    // 6. Compiler toutes les données pour le PDF
    const pdfData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        dateRange: "Dernières 48 heures",
        version: "1.0"
      },
      aiSummary: parsedSummary,
      rawData: {
        news: newsData || [],
        analysis: analysisData || null,
        oilPrices: {
          brent: oilData?.brent || null,
          wti: oilData?.wti || null,
          lastUpdate: oilData?.created_at || null
        }
      }
    };

    return NextResponse.json(pdfData);

  } catch (error) {
    console.error("❌ PDF Summary Generation Failed:", error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
