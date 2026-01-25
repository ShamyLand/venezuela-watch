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
    }).join('\n\n') || 'Aucune actualité récente disponible (Utiliser les données de l\'analyse existante).';

    // Préparer le contexte de l'analyse existante (Intel Feed / Dashboard)
    const existingAnalysisContext = analysisData ? JSON.stringify(analysisData) : "Aucune analyse existante.";

    // 5. Générer la synthèse avec Gemini (avec timeout)
    console.log("🤖 Generating AI summary for PDF...");

    let parsedSummary;

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash", // Use faster/better model if available, fallback to flash
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      // Timeout augmenté à 40 secondes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout après 40 secondes')), 40000)
      );

      const geminiPromise = model.generateContent([
        PDF_SUMMARY_PROMPT,
        `Voici les données à analyser:\n\n
        CONTEXTE ANALYSE EXISTANTE (DASHBOARD ACTUEL - TRES IMPORTANT):\n${existingAnalysisContext}\n\n
        ACTUALITÉS RÉCENTES (48h):\n${newsContext}\n\n
        PRIX DU PÉTROLE ACTUEL:\nBrent: ${oilData?.brent || 'N/A'} USD\nWTI: ${oilData?.wti || 'N/A'} USD\n\n
        Date actuelle: ${new Date().toISOString()}`
      ]);

      const result = await Promise.race([geminiPromise, timeoutPromise]) as any;
      const response = await result.response;
      let aiSummary = response.text();

      // Nettoyage du JSON
      aiSummary = aiSummary.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedSummary = JSON.parse(aiSummary);

      console.log("✅ AI summary generated successfully");
    } catch (geminiError) {
      console.error("⚠️ Gemini generation failed/timeout. Using Fallback from existing analysis.", geminiError);

      // SMART FALLBACK : Utiliser les données de l'analyse existante (Dashboard) au lieu de renvoyer du vide
      if (analysisData) {
        console.log("🔄 Using existing Database Analysis as fallback...");
        parsedSummary = {
          titre_rapport: "VENEZUELA WATCH - Rapport de Situation",
          sous_titre: `Basé sur l'analyse active du ${new Date(analysisData.created_at).toLocaleDateString('fr-FR')}`,
          synthese_executive: {
            resume_general: analysisData.flash_json?.content || analysisData.report_json?.content || "Analyse en cours...",
            points_cles: analysisData.flash_json?.points || ["Surveillance active", "Données en cours de traitement"],
            tendance_generale: analysisData.flash_json?.tendance || "NON DÉFINI",
            evaluation_risque: "MODÉRÉ" // Valeur par défaut si manquant
          },
          analyse_geopolitique: {
            contexte: analysisData.report_json?.geopolitique || "Voir dashboard pour détails.",
            developpements_recents: "Consultez le terminal Intel Feed pour les logs temps réel.",
            implications: "Situation sous surveillance active."
          },
          analyse_economique: {
            situation_petrole: analysisData.report_json?.economie_petrole || "Données pétrolières en cours d'actualisation.",
            marche_mondial: "Volatilité observée sur les marchés.",
            sanctions_economiques: "Impact des sanctions sous évaluation."
          },
          indicateurs_cles: analysisData.report_json?.indicateurs || {
            tension_geopolitique: 5.0,
            volatilite_petrole: 5.0,
            risque_sanctions: 5.0,
            stabilite_regionale: 5.0,
            pression_internationale: 5.0
          },
          timeline_evenements: [],
          alertes_actives: analysisData.alerts_json || [],
          previsions_court_terme: {
            "7_jours": "Maintien de la vigilance recommandé.",
            "facteurs_surveillance": ["Prix du pétrole", "Stabilité frontalière"]
          },
          sources_principales: ["Venezuela Watch Intelligence System"]
        };
      } else {
        // VRAI FALLBACK (Si même la DB est vide)
        parsedSummary = {
          titre_rapport: "VENEZUELA WATCH - Synthèse Géopolitique",
          sous_titre: `Rapport généré le ${new Date().toLocaleDateString('fr-FR')}`,
          synthese_executive: {
            resume_general: "Aucune donnée d'analyse disponible actuellement. Le système attend la prochaine synchronisation CRON.",
            points_cles: [
              "Données sources insuffisantes",
              "En attente de synchronisation",
              "Vérifiez la connexion API"
            ],
            tendance_generale: "INCONNUE",
            evaluation_risque: "INCONNU"
          },
          // Structure vide pour éviter le crash PDF
          analyse_geopolitique: { contexte: "N/A", developpements_recents: "N/A", implications: "N/A" },
          analyse_economique: { situation_petrole: "N/A", marche_mondial: "N/A", sanctions_economiques: "N/A" },
          indicateurs_cles: { tension_geopolitique: 0, volatilite_petrole: 0, risque_sanctions: 0, stabilite_regionale: 0, pression_internationale: 0 },
          timeline_evenements: [],
          alertes_actives: [],
          previsions_court_terme: { "7_jours": "N/A", facteurs_surveillance: [] },
          sources_principales: []
        };
      }
    }

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
