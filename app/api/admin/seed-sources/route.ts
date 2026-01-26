import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { RSS_FEEDS } from '@/lib/news-service';

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
    try {
        console.log(`Starting seed of ${RSS_FEEDS.length} sources...`);

        const sourcesToInsert = RSS_FEEDS.map(feed => ({
            name: feed.source,
            url: feed.url,
            category: feed.category,
            reliability_score: feed.reliability,
            language: feed.language,
            is_active: true,
            last_fetched_at: new Date().toISOString()
        }));

        // Upsert to avoid duplicates (assuming URL is unique constraint)
        const { data, error } = await supabase
            .from('sources')
            .upsert(sourcesToInsert, { onConflict: 'url' })
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded/updated ${data.length} sources`,
            count: data.length
        });

    } catch (error) {
        console.error('Seeding Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
