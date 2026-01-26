import { NextResponse } from 'next/server';
import { RSS_FEEDS } from '@/lib/news-service';

export async function GET() {
    return NextResponse.json({
        count: RSS_FEEDS.length,
        sources: RSS_FEEDS
    });
}
