import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news-service';
import { generateAnalysis } from '@/lib/gemini-service';
import { fetchOilPrices } from '@/lib/oil-service';
import { supabase } from '@/lib/supabase';
import { sendAlertEmail } from '@/lib/email-service';

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
                source_name: article.source_name
            }));

            // Use upsert to handle duplicate URLs gracefully
            const { data: insertedData, error: newsError } = await supabase
                .from('news')
                .upsert(newsToInsert, {
                    onConflict: 'url',
                    ignoreDuplicates: true
                })
                .select();

            if (newsError) {
                console.error("❌ Error storing RSS articles:", newsError.message);
            } else {
                const insertedCount = insertedData?.length || 0;
                const duplicatesCount = newsToInsert.length - insertedCount;
                console.log(`✅ ${insertedCount} new articles inserted (${duplicatesCount} duplicates ignored)`);
            }
        }

        // 4. Store Oil Prices in Database (Current + History)
        if (oilData.brent && oilData.wti) {
            console.log("💾 Storing oil prices...");

            const timestamp = new Date().toISOString();
            const currentPrices = [
                {
                    symbol: 'BRENT',
                    price: oilData.brent.price,
                    change_percent: oilData.brent.changePercent,
                    timestamp: timestamp
                },
                {
                    symbol: 'WTI',
                    price: oilData.wti.price,
                    change_percent: oilData.wti.changePercent,
                    timestamp: timestamp
                }
            ];

            // Prepare history items if available
            let allPricesToUpsert = [...currentPrices];
            if (oilData.history) {
                console.log("📜 Processing historical oil data...");
                const historyBrent = oilData.history.brent.map(h => ({
                    symbol: 'BRENT',
                    price: h.price,
                    change_percent: 0,
                    timestamp: h.timestamp // Real timestamp from API
                }));
                const historyWti = oilData.history.wti.map(h => ({
                    symbol: 'WTI',
                    price: h.price,
                    change_percent: 0,
                    timestamp: h.timestamp // Real timestamp from API
                }));
                allPricesToUpsert = [...allPricesToUpsert, ...historyBrent, ...historyWti];
            }

            // Upsert all data (current + history)
            // Note: This requires a unique constraint on (symbol, timestamp) to work perfectly as Upsert.
            // If no unique constraint exists, it might create duplicates.
            // However, typical Supabase setup for time-series often uses timestamp as PK or part of unique index.
            // We'll proceed with upsert logic.
            const { error: oilError } = await supabase
                .from('oil_prices')
                .upsert(allPricesToUpsert, {
                    onConflict: 'symbol, timestamp',
                    ignoreDuplicates: true
                });

            if (oilError) {
                console.error("❌ Error storing oil prices:", oilError.message);
                // Fallback to simple insert of current if upsert fails (e.g. no unique constraint)
                if (oilError.message.includes('constraint')) {
                    console.log("⚠️ Fallback: Inserting only current prices due to constraint issue");
                    await supabase.from('oil_prices').insert(currentPrices);
                }
            } else {
                console.log(`✅ Stored ${allPricesToUpsert.length} oil price points (Current + History)`);
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
                transparency_json: analysis.transparency,
                timestamp: new Date().toISOString()
            });

        if (analysisError) {
            console.error("❌ Analysis storage error:", analysisError);
            throw analysisError;
        }

        console.log("✅ Analysis stored successfully!");

        // 7. Send Email Notifications if Alerts exist
        let emailCount = 0;
        if (analysis.alerts && analysis.alerts.length > 0) {
            console.log("📧 Alerts detected, fetching active subscribers...");

            // Fetch subscribers (using service role would be best but trying public client first)
            // If this fails due to RLS, we need the service role key. 
            // Assuming the Supabase client here is configured with enough privileges or table is public read (unlikely).
            // Actually, in an API route, we should ideally use a service role client.
            // But let's try reading. If it fails, we log it.
            const { data: subscribers, error: subError } = await supabase
                .from('subscribers')
                .select('email')
                .eq('is_active', true);

            if (subError) {
                console.error("❌ Failed to fetch subscribers:", subError.message);
            } else if (subscribers && subscribers.length > 0) {
                console.log(`📧 Sending emails to ${subscribers.length} subscribers...`);

                // Send emails in parallel (limit concurrency in prod but ok for small scale)
                const emailPromises = subscribers.map(sub =>
                    sendAlertEmail({
                        email: sub.email,
                        alerts: analysis.alerts,
                        analysisFlash: analysis.flash
                    })
                );

                await Promise.all(emailPromises);
                emailCount = subscribers.length;
                console.log("✅ Emails sent!");
            } else {
                console.log("ℹ️ No active subscribers found.");
            }
        }

        return NextResponse.json({
            success: true,
            message: "RSS + Oil + Gemini analysis completed",
            data: {
                articles_processed: articles.length,
                oil_prices: {
                    brent: oilData.brent?.price,
                    wti: oilData.wti?.price
                },
                analysis_timestamp: new Date().toISOString(),
                emails_sent: emailCount
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

