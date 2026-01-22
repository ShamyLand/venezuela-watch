import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news-service';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google-cloud/generative-ai';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("🚀 Lancement de l'analyse Antigravity...");

        // 1. Récupération des actualités (votre service d'origine)
        const articles = await fetchNews();
        if (!articles || articles.length === 0) {
            return NextResponse.json({ message: "Aucune news trouvée", success: false });
        }

        // 2. Préparation du contexte pour Gemini (Top 15)
        const recentArticles = articles.slice(0, 15);
        const context = recentArticles.map((a: any, i: number) =>
            `${i + 1}. [${a.source}] ${a.title}`
        ).join('\n');

        // 3. Initialisation de Gemini avec le nouveau Prompt de notation
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            Tu es un expert en renseignement stratégique sur le Venezuela.
            Analyse ces actualités :
            ${context}

            Répond EXCLUSIVEMENT sous forme d'un objet JSON strict avec cette structure :
            {
              "flash": { "content": "Une phrase courte et percutante en italique." },
              "scores": {
                "tension": note de 1 à 10 sur la tension politique (ex: 7.5),
                "volatility": note de 1 à 10 sur la volatilité du pétrole (ex: 6.2),
                "risk": note de 1 à 10 sur le risque global (ex: 8.1)
              },
              "report": "Une analyse détaillée de deux paragraphes sur la situation actuelle.",
              "alerts": [
                {"title": "NOM ALERTE", "description": "Détails de l'alerte"}
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        const jsonOutput = JSON.parse(text);

        // 4. Enregistrement des News dans Supabase (votre logique d'origine)
        const newsToInsert = recentArticles.map((a: any) => ({
            title_original: a.title,
            url: a.url,
            published_at: a.publishedAt,
            source_name: a.source,
            language: 'en',
            title_fr: a.title 
        }));
        await supabase.from('news').upsert(newsToInsert, { onConflict: 'url', ignoreDuplicates: true });

        // 5. Enregistrement de l'Analyse avec les NOTES DYNAMIQUES
        const { error: analysisError } = await supabase
            .from('analyses')
            .insert({
                flash_json: jsonOutput.flash,
                report_json: {
                    content: jsonOutput.report,
                    tension: jsonOutput.scores.tension,
                    volatility: jsonOutput.scores.volatility,
                    risk: jsonOutput.scores.risk
                },
                alerts_json: jsonOutput.alerts
            });

        if (analysisError) throw analysisError;

        return NextResponse.json({ success: true, message: "Analyse et notation terminées" });

    } catch (error: any) {
        console.error("🔥 Erreur analyse:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
