import Parser from 'rss-parser';

const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['dc:creator', 'creator']
        ]
    }
});

// Liste des flux RSS fiables sur le Venezuela et l'Amérique Latine
const RSS_FEEDS = [
    // Reuters
    {
        url: 'https://www.reuters.com/rssFeed/worldNews',
        source: 'Reuters',
        category: 'International'
    },
    // BBC News
    {
        url: 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml',
        source: 'BBC News',
        category: 'Latin America'
    },
    // Associated Press
    {
        url: 'https://apnews.com/index.rss',
        source: 'Associated Press',
        category: 'World'
    },
    // The Guardian World News
    {
        url: 'https://www.theguardian.com/world/rss',
        source: 'The Guardian',
        category: 'World'
    },
    // France 24 Americas
    {
        url: 'https://www.france24.com/en/americas/rss',
        source: 'France 24',
        category: 'Americas'
    },
    // Al Jazeera Americas
    {
        url: 'https://www.aljazeera.com/xml/rss/all.xml',
        source: 'Al Jazeera',
        category: 'World'
    },
    // Financial Times World
    {
        url: 'https://www.ft.com/world?format=rss',
        source: 'Financial Times',
        category: 'World'
    }
];

// Mots-clés pour filtrer les articles pertinents sur le Venezuela
const VENEZUELA_KEYWORDS = [
    'venezuela',
    'venezuelan',
    'maduro',
    'caracas',
    'pdvsa',
    'guaido',
    'machado',
    'maría corina',
    'latin america',
    'south america'
];

interface NewsArticle {
    title: string;
    title_original?: string;
    url: string;
    published_at: string;
    source_name: string;
    summary?: string;
    language: string;
}

/**
 * Vérifie si un article est pertinent pour le Venezuela
 */
function isRelevantToVenezuela(title: string, description: string): boolean {
    const text = `${title} ${description}`.toLowerCase();
    return VENEZUELA_KEYWORDS.some(keyword => text.includes(keyword));
}

/**
 * Parse un flux RSS et extrait les articles
 */
async function parseFeed(feedUrl: string, source: string): Promise<NewsArticle[]> {
    try {
        const feed = await parser.parseURL(feedUrl);
        const articles: NewsArticle[] = [];

        for (const item of feed.items) {
            // Filtrer uniquement les articles sur le Venezuela
            const title = item.title || '';
            const description = item.contentSnippet || item.content || '';

            if (isRelevantToVenezuela(title, description)) {
                articles.push({
                    title: title,
                    title_original: title,
                    url: item.link || '',
                    published_at: item.pubDate || new Date().toISOString(),
                    source_name: source,
                    summary: description.substring(0, 200),
                    language: 'en'
                });
            }
        }

        return articles;
    } catch (error) {
        console.error(`❌ Error parsing feed from ${source}:`, error);
        return [];
    }
}

/**
 * Agrège les news de tous les flux RSS
 */
export async function fetchNewsFromRSS(): Promise<NewsArticle[]> {
    console.log(`📡 Fetching news from ${RSS_FEEDS.length} RSS feeds...`);

    const allArticles: NewsArticle[] = [];

    // Parse tous les flux en parallèle
    const feedPromises = RSS_FEEDS.map(feed =>
        parseFeed(feed.url, feed.source)
    );

    const results = await Promise.allSettled(feedPromises);

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            allArticles.push(...result.value);
            console.log(`✅ ${RSS_FEEDS[index].source}: ${result.value.length} articles`);
        } else {
            console.error(`❌ ${RSS_FEEDS[index].source}: Failed`);
        }
    });

    // Trier par date (plus récents d'abord)
    allArticles.sort((a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );

    console.log(`📰 Total: ${allArticles.length} articles pertinents sur le Venezuela`);

    return allArticles;
}

/**
 * Fallback mock data si tous les flux échouent
 */
export async function fetchNews(): Promise<NewsArticle[]> {
    try {
        const articles = await fetchNewsFromRSS();

        // Si aucun article trouvé, retourner des mocks
        if (articles.length === 0) {
            console.warn("⚠️ No RSS articles found, using fallback mock data");
            return getMockArticles();
        }

        return articles;
    } catch (error) {
        console.error("❌ RSS fetch failed completely:", error);
        return getMockArticles();
    }
}

function getMockArticles(): NewsArticle[] {
    return [
        {
            title: "Venezuela economic situation remains uncertain",
            url: "https://reuters.com/mock-1",
            published_at: new Date().toISOString(),
            source_name: "Reuters",
            summary: "Mock article for testing purposes",
            language: "en"
        },
        {
            title: "PDVSA oil production figures released",
            url: "https://bloomberg.com/mock-2",
            published_at: new Date().toISOString(),
            source_name: "Bloomberg",
            summary: "Mock article for testing purposes",
            language: "en"
        },
        {
            title: "International community discusses Venezuela sanctions",
            url: "https://bbc.com/mock-3",
            published_at: new Date().toISOString(),
            source_name: "BBC News",
            summary: "Mock article for testing purposes",
            language: "en"
        }
    ];
}
