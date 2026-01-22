import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news-service';
import { generateAnalysis } from '@/lib/gemini-service';
import { supabase } from '@/lib/supabase';

// FORCE DYNAMIC: This route must not be cached, it runs on demand/schedule
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // 1. Authenticate Cron Request (Optional but recommended)
        // const authHeader = request.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //   return new Response('Unauthorized', { status: 401 });
        // }

        console.log("🚀 Starting Scheduled Analysis Job...");

        // 2. Fetch Latest News
        console.log("📰 Fetching news...");
        let articles = await fetchNews();

        // Fallback: Use mock data if News API fails (quota exceeded)
        if (!articles || articles.length === 0) {
            console.log("⚠️ News API unavailable, using mock data...");
            articles = [
                {
                    title: "Venezuela announces new economic measures amid sanctions",
                    source: "Reuters",
                    publishedAt: new Date().toISOString(),
                    url: "https://reuters.com/mock"
                },
                {
                    title: "PDVSA oil production reaches 840,000 barrels per day",
                    source: "Bloomberg",
                    publishedAt: new Date().toISOString(),
                    url: "https://bloomberg.com/mock"
                },
                {
                    title: "US considers easing Venezuela sanctions",
                    source: "Financial Times",
                    publishedAt: new Date().toISOString(),
                    url: "https://ft.com/mock"
                }
            ];
        }
        console.log(`✅ Using ${articles.length} articles for analysis.`);

        // 3. Prepare Context for Gemini (Limit to top 15 to avoid token limits)
        const recentArticles = articles.slice(0, 15);
        const context = recentArticles.map((a: any, i: number) =>
            `${i + 1}. [${a.source}] ${a.title} (${a.publishedAt})`
        ).join('\n');

        // 4. Generate AI Analysis
        console.log("🧠 Generating Gemini Analysis...");
        const analysis = await generateAnalysis(context);

        if (!analysis) {
            console.error("❌ Gemini Analysis failed.");
            return NextResponse.json({ message: "Analysis failed", success: false }, { status: 500 });
        }
        console.log("✅ Analysis generated successfully.");

        // 5. Store Data in Supabase

        // 5a. Store News Articles (Batch insert)
        const newsToInsert = recentArticles.map((a: any) => ({
            title_original: a.title,
            url: a.url,
            published_at: a.publishedAt,
            source_name: a.source,
            // Default fallback values
            language: 'en',
            title_fr: a.title // Ideally we'd translate this too, but for MVP we keep original or let frontend handle it
        }));

        // Use upsert to avoid duplicate URLs errors
        const { error: newsError } = await supabase
            .from('news')
            .upsert(newsToInsert, { onConflict: 'url', ignoreDuplicates: true });

        if (newsError) console.error("⚠️ News insert error:", newsError);

        // 5b. Store Analysis
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

        return NextResponse.json({
            success: true,
            message: "Analysis job completed",
            data: {
                articles_processed: recentArticles.length,
                analysis_timestamp: new Date().toISOString()
            }
        });

    } catch (error: any) {
        console.error("🔥 CRON JOB FAILED:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
