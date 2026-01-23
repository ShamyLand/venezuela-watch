import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news-service';
import { generateAnalysis } from '@/lib/gemini-service';
import { supabase } from '@/lib/supabase';

// FORCE DYNAMIC: This route must not be cached, it runs on demand/schedule
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        console.log("🚀 Starting RSS + Gemini Analysis Job...");

        // 1. Fetch News from RSS Feeds (7 sources)
        console.log("📡 Fetching from RSS feeds...");
        const articles = await fetchNews();
        console.log(`✅ Retrieved ${articles.length} articles from RSS`);

        // 2. Store News in Database
        if (articles.length > 0) {
            console.log("💾 Storing RSS articles...");

            const newsToInsert = articles.map((article: any) => ({
                title_original: article.title_original || article.title,
                title_fr: article.title,
                url: article.url,
                published_at: article.published_at,
                source_name: article.source_name,
                language: article.language || 'en'
            }));

            const { error: newsError } = await supabase
                .from('news')
                .insert(newsToInsert);

            if (newsError) {
                console.warn("⚠️ Some RSS articles couldn't be stored:", newsError.message);
            } else {
                console.log(`✅ ${newsToInsert.length} RSS articles stored`);
            }
        }

        // 3. Generate AI Analysis from RSS articles
        console.log("🤖 Generating Gemini analysis from RSS data...");

        const newsContext = JSON.stringify({
            articles: articles.slice(0, 15).map((a: any) => ({
                title: a.title,
                source: a.source_name,
                published: a.published_at,
                url: a.url,
                summary: a.summary
            }))
        });

        const analysis = await generateAnalysis(newsContext);

        if (!analysis) {
            console.log("❌ Gemini analysis failed.");
            return NextResponse.json({ message: "Analysis failed", success: false });
        }

        console.log("✅ Gemini analysis generated successfully!");

        // 4. Store Analysis
        console.log("💾 Storing analysis...");
        const { error: analysisError } = await supabase
            .from('analyses')
            .insert({
                flash_json: analysis.flash,
                report_json: analysis.report,
                alerts_json: analysis.alerts
            });

        if (analysisError) {
            console.error("❌ Analysis storage error:", analysisError);
            throw analysisError;
        }

        console.log("✅ Analysis stored successfully!");

        return NextResponse.json({
            success: true,
            message: "RSS + Gemini analysis completed",
            data: {
                articles_processed: articles.length,
                analysis_timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("❌ Analysis Job Error:", error);
        return NextResponse.json({
            message: "Analysis failed",
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
