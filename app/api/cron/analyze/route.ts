import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news-service';
import { generateAnalysis } from '@/lib/gemini-service';
import { fetchOilPrices } from '@/lib/oil-service';
import { supabase } from '@/lib/supabase';

// FORCE DYNAMIC: This route must not be cached, it runs on demand/schedule
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        console.log("🚀 Starting RSS + Gemini + Oil Prices Analysis Job...");

        // 1. Fetch News from RSS Feeds (7 sources)
        console.log("📡 Fetching from RSS feeds...");
        const articles = await fetchNews();
        console.log(`✅ Retrieved ${articles.length} articles from RSS`);

        // 2. Fetch Oil Prices
        console.log("🛢️ Fetching oil prices...");
        const oilData = await fetchOilPrices();
        console.log(`✅ Oil prices: Brent $${oilData.brent?.price}, WTI $${oilData.wti?.price}`);

        // 3. Store News in Database
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

        // 4. Store Oil Prices in Database
        if (oilData.brent && oilData.wti) {
            console.log("💾 Storing oil prices...");

            const { error: oilError } = await supabase
                .from('oil_prices')
                .insert({
                    brent_price: oilData.brent.price,
                    brent_change: oilData.brent.change,
                    brent_change_percent: oilData.brent.changePercent,
                    wti_price: oilData.wti.price,
                    wti_change: oilData.wti.change,
                    wti_change_percent: oilData.wti.changePercent,
                    timestamp: new Date().toISOString()
                });

            if (oilError) {
                console.warn("⚠️ Oil prices couldn't be stored:", oilError.message);
            } else {
                console.log("✅ Oil prices stored");
            }
        }

        // 5. Generate AI Analysis from RSS articles
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

        // 6. Store Analysis
        console.log("💾 Storing analysis...");
        const { error: analysisError } = await supabase
            .from('analyses')
            .insert({
                flash_json: analysis.flash,
                report_json: analysis.report,
                alerts_json: analysis.alerts,
                timestamp: new Date().toISOString()
            });

        if (analysisError) {
            console.error("❌ Analysis storage error:", analysisError);
            throw analysisError;
        }

        console.log("✅ Analysis stored successfully!");

        return NextResponse.json({
            success: true,
            message: "RSS + Oil + Gemini analysis completed",
            data: {
                articles_processed: articles.length,
                oil_prices: {
                    brent: oilData.brent?.price,
                    wti: oilData.wti?.price
                },
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
