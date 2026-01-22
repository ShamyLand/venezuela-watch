import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news-service';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google-cloud/generative-ai';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // 1. Récupération des news
        const articles = await fetchNews();
        if (!articles || articles.length === 0) return NextResponse.json({ message: "No news" });

        const context = articles.slice(0, 15).map((a: any) => `- ${a.title}`).join('\n');

        // 2. Prompt de notation pour Gemini
        const prompt = `
            Analyse ces actualités du Venezuela :
            ${context}

            Réponds EXCLUSIVEMENT en JSON avec ce format :
            {
              "flash": "Texte court",
              "report": {
                "tension": note de 1 à 10 (ex: 7.2),
                "volatility": note de 1 à 10 (ex: 6.5),
                "risk": note de 1 à 10 (ex: 8.0),
                "content": "Texte détaillé de l'analyse"
              },
              "alerts": [{"title": "...", "description": "..."}]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonOutput = JSON.parse(response.text().replace(/```json|```/g, ""));

        // 3. Sauvegarde dans Supabase
        await supabase.from('analyses').insert({
            flash_json: { content: jsonOutput.flash },
            report_json: jsonOutput.report, // Contient maintenant les notes + le texte
            alerts_json: jsonOutput.alerts
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
