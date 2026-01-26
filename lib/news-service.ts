import Parser from 'rss-parser';

const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['dc:creator', 'creator']
        ]
    }
});

interface RSSFeed {
    url: string;
    source: string;
    category: 'International' | 'Latin America' | 'Venezuela' | 'Economy' | 'Oil' | 'NGO/Gov';
    reliability: number; // 1-10 score
    language: 'en' | 'es' | 'fr';
}

// Liste des flux RSS fiables sur le Venezuela et l'Amérique Latine
export const RSS_FEEDS: RSSFeed[] = [
    // --- INTERNATIONAL MAJORS (20) ---
    { url: 'https://www.reuters.com/rssFeed/worldNews', source: 'Reuters', category: 'International', reliability: 10, language: 'en' },
    { url: 'https://apnews.com/index.rss', source: 'AP News', category: 'International', reliability: 10, language: 'en' },
    { url: 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml', source: 'BBC News', category: 'International', reliability: 9, language: 'en' },
    { url: 'https://www.theguardian.com/world/rss', source: 'The Guardian', category: 'International', reliability: 8, language: 'en' },
    { url: 'https://www.france24.com/en/americas/rss', source: 'France 24 (EN)', category: 'International', reliability: 9, language: 'en' },
    { url: 'https://www.france24.com/fr/ameriques/rss', source: 'France 24 (FR)', category: 'International', reliability: 9, language: 'fr' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera', category: 'International', reliability: 8, language: 'en' },
    { url: 'https://rss.dw.com/xml/rss-en-world', source: 'Deutsche Welle', category: 'International', reliability: 9, language: 'en' },
    { url: 'https://feeds.npr.org/1004/rss.xml', source: 'NPR', category: 'International', reliability: 9, language: 'en' },
    { url: 'https://www.pbs.org/newshour/feeds/rss/world', source: 'PBS NewsHour', category: 'International', reliability: 9, language: 'en' },
    { url: 'https://www.cbc.ca/cmlink/rss-world', source: 'CBC News', category: 'International', reliability: 9, language: 'en' },
    { url: 'https://www.independent.co.uk/news/world/rss', source: 'The Independent', category: 'International', reliability: 7, language: 'en' },
    { url: 'https://feeds.skynews.com/feeds/rss/world.xml', source: 'Sky News', category: 'International', reliability: 7, language: 'en' },
    { url: 'https://www.rtbf.be/rss/actualites/monde', source: 'RTBF', category: 'International', reliability: 9, language: 'fr' },
    { url: 'https://www.lemonde.fr/ameriques/rss_full.xml', source: 'Le Monde', category: 'International', reliability: 9, language: 'fr' },
    { url: 'https://www.lefigaro.fr/rss/figaro_international.xml', source: 'Le Figaro', category: 'International', reliability: 8, language: 'fr' },
    { url: 'https://elpais.com/rss/internacional/portada.xml', source: 'El Pais (ES)', category: 'International', reliability: 9, language: 'es' },
    { url: 'https://www.elmundo.es/rss/internacional.xml', source: 'El Mundo', category: 'International', reliability: 8, language: 'es' },
    { url: 'https://news.un.org/feed/subscribe/en/news/region/americas/feed/rss.xml', source: 'UN News', category: 'NGO/Gov', reliability: 10, language: 'en' },
    { url: 'https://www.voanews.com/api/z$opimtejo', source: 'Voice of America', category: 'International', reliability: 7, language: 'en' },

    // --- LATIN AMERICA REGIONAL (15) ---
    { url: 'https://www.eltiempo.com/rss/mundo_latinoamerica.xml', source: 'El Tiempo (Colombia)', category: 'Latin America', reliability: 8, language: 'es' },
    { url: 'https://www.elespectador.com/rss/mundo/america/', source: 'El Espectador (Colombia)', category: 'Latin America', reliability: 8, language: 'es' },
    { url: 'https://www.clarin.com/rss/mundo/', source: 'Clarín (Argentina)', category: 'Latin America', reliability: 8, language: 'es' },
    { url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml&id=18', source: 'La Nación (Argentina)', category: 'Latin America', reliability: 8, language: 'es' },
    { url: 'https://oglobo.globo.com/rss/mundo.xml', source: 'O Globo (Brazil)', category: 'Latin America', reliability: 8, language: 'es' }, // Often pt, but useful
    { url: 'https://www.eluniversal.com.mx/rss.xml', source: 'El Universal (Mexico)', category: 'Latin America', reliability: 8, language: 'es' },
    { url: 'https://www.jornada.com.mx/rss/mundo.xml', source: 'La Jornada (Mexico)', category: 'Latin America', reliability: 7, language: 'es' },
    { url: 'https://www.latercera.com/feed/manager?type=rss&sc=mundo', source: 'La Tercera (Chile)', category: 'Latin America', reliability: 8, language: 'es' },
    { url: 'https://elcomercio.pe/feed/mundo/', source: 'El Comercio (Peru)', category: 'Latin America', reliability: 8, language: 'es' },
    { url: 'https://www.semana.com/rss/mundo/', source: 'Semana (Colombia)', category: 'Latin America', reliability: 6, language: 'es' },
    { url: 'https://cnnespanol.cnn.com/feed/', source: 'CNN En Español', category: 'Latin America', reliability: 8, language: 'es' },
    { url: 'https://www.infobae.com/feeds/rss/america/', source: 'Infobae', category: 'Latin America', reliability: 6, language: 'es' },
    { url: 'https://mercopress.com/rss/', source: 'MercoPress', category: 'Latin America', reliability: 7, language: 'en' },
    { url: 'https://www.telesurtv.net/rss/english.xml', source: 'TeleSur (EN)', category: 'Latin America', reliability: 4, language: 'en' }, // BIAS ALERT: Pro-Maduro
    { url: 'https://www.telesurtv.net/rss/rss.xml', source: 'TeleSur (ES)', category: 'Latin America', reliability: 4, language: 'es' },   // BIAS ALERT: Pro-Maduro

    // --- VENEZUELA SPECIFIC (15) ---
    // Mix of Independent, Opposition, and State Media for balance
    { url: 'https://www.elnacional.com/feed/', source: 'El Nacional', category: 'Venezuela', reliability: 7, language: 'es' },
    { url: 'https://efectococuyo.com/feed/', source: 'Efecto Cocuyo', category: 'Venezuela', reliability: 8, language: 'es' },
    { url: 'https://talcualdigital.com/feed/', source: 'TalCual', category: 'Venezuela', reliability: 8, language: 'es' },
    { url: 'https://elpitazo.net/feed/', source: 'El Pitazo', category: 'Venezuela', reliability: 8, language: 'es' },
    { url: 'https://runrun.es/feed/', source: 'RunRun.es', category: 'Venezuela', reliability: 7, language: 'es' },
    { url: 'https://www.lapatilla.com/feed/', source: 'La Patilla', category: 'Venezuela', reliability: 5, language: 'es' }, // Opposition bias
    { url: 'https://elestimulo.com/feed/', source: 'El Estímulo', category: 'Venezuela', reliability: 7, language: 'es' },
    { url: 'https://cronica.uno/feed/', source: 'Crónica Uno', category: 'Venezuela', reliability: 8, language: 'es' },
    { url: 'https://armando.info/feed/', source: 'Armando.info', category: 'Venezuela', reliability: 9, language: 'es' }, // Investigative
    { url: 'https://contrapunto.com/feed/', source: 'Contrapunto', category: 'Venezuela', reliability: 7, language: 'es' },
    { url: 'https://ultimasnoticias.com.ve/feed/', source: 'Últimas Noticias', category: 'Venezuela', reliability: 4, language: 'es' }, // Pro-Gov bias
    { url: 'https://eluniversal.com/rss', source: 'El Universal (Vzla)', category: 'Venezuela', reliability: 5, language: 'es' }, // Pro-Gov leaning
    { url: 'https://globovision.com/feed', source: 'Globovisión', category: 'Venezuela', reliability: 4, language: 'es' }, // Pro-Gov
    { url: 'https://diariolavoradordelaverdad.com/feed/', source: 'La Verdad de Vargas', category: 'Venezuela', reliability: 6, language: 'es' },
    { url: 'https://correodelcaroni.com/feed/', source: 'Correo del Caroní', category: 'Venezuela', reliability: 7, language: 'es' },

    // --- ECONOMY & OIL (15) ---
    { url: 'https://oilprice.com/rss/main', source: 'OilPrice.com', category: 'Oil', reliability: 9, language: 'en' },
    { url: 'https://www.bloomberg.com/energy/rss', source: 'Bloomberg Energy', category: 'Oil', reliability: 9, language: 'en' },
    { url: 'https://www.ft.com/energy?format=rss', source: 'Financial Times Energy', category: 'Oil', reliability: 9, language: 'en' },
    { url: 'https://www.cnbc.com/id/19836768/device/rss/rss.html', source: 'CNBC Energy', category: 'Oil', reliability: 8, language: 'en' },
    { url: 'https://www.investing.com/rss/commodities.rss', source: 'Investing.com', category: 'Oil', reliability: 7, language: 'en' },
    { url: 'https://www.reuters.com/rssFeed/businessNews', source: 'Reuters Business', category: 'Economy', reliability: 10, language: 'en' },
    { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', source: 'MarketWatch', category: 'Economy', reliability: 8, language: 'en' },
    { url: 'https://www.economist.com/the-americas/rss.xml', source: 'The Economist', category: 'Economy', reliability: 9, language: 'en' },
    { url: 'https://www.wsj.com/xml/rss/3_7085.xml', source: 'WSJ World', category: 'Economy', reliability: 9, language: 'en' },
    { url: 'https://www.forbes.com/energy/feed/', source: 'Forbes Energy', category: 'Oil', reliability: 7, language: 'en' },
    { url: 'https://www.argusmedia.com/en/rss/oil', source: 'Argus Media', category: 'Oil', reliability: 9, language: 'en' },
    { url: 'https://www.spglobal.com/commodityinsights/en/rss/oil', source: 'S&P Global Platts', category: 'Oil', reliability: 10, language: 'en' },
    { url: 'https://www.eia.gov/rss/petroleum.xml', source: 'EIA.gov', category: 'Oil', reliability: 10, language: 'en' },
    { url: 'https://www.iea.org/rss/news', source: 'IEA', category: 'Oil', reliability: 10, language: 'en' },
    { url: 'https://www.opec.org/opec_web/en/rss/press_releases.xml', source: 'OPEC', category: 'Oil', reliability: 10, language: 'en' },

    // --- NGO & THINK TANKS (10) ---
    { url: 'https://www.hrw.org/rss/news', source: 'Human Rights Watch', category: 'NGO/Gov', reliability: 9, language: 'en' },
    { url: 'https://www.amnesty.org/en/rss', source: 'Amnesty International', category: 'NGO/Gov', reliability: 9, language: 'en' },
    { url: 'https://www.crisisgroup.org/rss/latin-america-caribbean', source: 'Crisis Group', category: 'NGO/Gov', reliability: 9, language: 'en' },
    { url: 'https://www.csis.org/rss/regions/americas', source: 'CSIS', category: 'NGO/Gov', reliability: 9, language: 'en' },
    { url: 'https://www.atlanticcouncil.org/feed/', source: 'Atlantic Council', category: 'NGO/Gov', reliability: 8, language: 'en' },
    { url: 'https://www.wola.org/feed/', source: 'WOLA', category: 'NGO/Gov', reliability: 9, language: 'en' },
    { url: 'https://venezuelanalysis.com/feed/', source: 'Venezuelanalysis', category: 'Venezuela', reliability: 5, language: 'en' }, // Left/Pro-Gov bias
    { url: 'https://www.caracaschronicles.com/feed/', source: 'Caracas Chronicles', category: 'Venezuela', reliability: 8, language: 'en' }, // Opposition leaning
    { url: 'https://insightcrime.org/feed/', source: 'InSight Crime', category: 'NGO/Gov', reliability: 9, language: 'en' },
    { url: 'https://www.state.gov/rss/feed/western-hemisphere', source: 'US State Dept', category: 'NGO/Gov', reliability: 10, language: 'en' }
];

// Mots-clés pour filtrer les articles pertinents sur le Venezuela
const VENEZUELA_KEYWORDS = [
    'venezuela', 'venezuelan', 'maduro', 'caracas', 'pdvsa', 'guaido',
    'machado', 'maría corina', 'latin america', 'south america',
    'oil sanctions', 'opec', 'crude oil', 'colombia', 'guyana',
    'essequibo', 'cabello', 'plesbicit', 'corina yoris'
];

interface NewsArticle {
    title: string;
    title_original?: string;
    url: string;
    published_at: string;
    source_name: string;
    summary?: string;
    language: string;
    reliability_score?: number;
    category?: string;
}

/**
 * Vérifie si un article est pertinent pour le Venezuela
 */
function isRelevantToVenezuela(title: string, description: string): boolean {
    const text = `${title} ${description}`.toLowerCase();

    // Strict Keywords for International/General Feeds to avoid noise
    if (!text.includes('venezuela') && !text.includes('maduro') && !text.includes('caracas') && !text.includes('pdvsa') && !text.includes('machado')) {
        // If it's a general feed and doesn't explicitly mention Venezuela/Maduro/Caracas, skip it
        // unless it has other strong keywords like Essequibo
        if (!text.includes('essequibo') && !text.includes('guyana')) {
            return false;
        }
    }

    return VENEZUELA_KEYWORDS.some(keyword => text.includes(keyword));
}

/**
 * Parse un flux RSS et extrait les articles
 */
async function parseFeed(feed: RSSFeed): Promise<NewsArticle[]> {
    try {
        // Timeout handling for slow feeds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout per feed

        const feedData = await parser.parseURL(feed.url);
        clearTimeout(timeoutId);

        const articles: NewsArticle[] = [];

        for (const item of feedData.items) {
            const title = item.title || '';
            const description = item.contentSnippet || item.content || '';

            // If it's a Venezuela-specific feed, we can be less strict with relevance check
            // If it's general, verify relevance
            const isTargetedFeed = feed.category === 'Venezuela';

            if (isTargetedFeed || isRelevantToVenezuela(title, description)) {
                articles.push({
                    title: title,
                    title_original: title,
                    url: item.link || '',
                    published_at: item.pubDate || new Date().toISOString(),
                    source_name: feed.source,
                    summary: description.substring(0, 300), // Reduce size for context window
                    language: feed.language,
                    reliability_score: feed.reliability,
                    category: feed.category
                });
            }
        }

        return articles;
    } catch (error) {
        // Silent failure for individual feeds is expected when dealing with 80+ sources
        // console.error(`⚠️ Feed failed: ${feed.source}`); 
        return [];
    }
}

/**
 * Agrège les news de tous les flux RSS (Batch processing to avoid memory spikes)
 */
export async function fetchNewsFromRSS(): Promise<NewsArticle[]> {
    console.log(`📡 Fetching news from ${RSS_FEEDS.length} RSS feeds across World/LatAm/Economy...`);

    const allArticles: NewsArticle[] = [];

    // Process in batches of 10 to avoid overwhelming network/CPU
    const BATCH_SIZE = 10;
    for (let i = 0; i < RSS_FEEDS.length; i += BATCH_SIZE) {
        const batch = RSS_FEEDS.slice(i, i + BATCH_SIZE);
        const promises = batch.map(feed => parseFeed(feed));

        const results = await Promise.all(promises);
        results.forEach(feedArticles => {
            allArticles.push(...feedArticles);
        });

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Remove duplicates by URL
    const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.url, item])).values());

    // Trier par date (plus récents d'abord)
    uniqueArticles.sort((a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );

    console.log(`📰 Total: ${uniqueArticles.length} unique relevant articles found from ${RSS_FEEDS.length} sources`);

    return uniqueArticles;
}

/**
 * Fallback mock data structure 
 */
function getMockArticles(): NewsArticle[] {
    const now = new Date();
    return [
        {
            title: "System Update: Data sources unavailable",
            url: `https://system.local/alert`,
            published_at: now.toISOString(),
            source_name: "System",
            summary: "Unable to retrieve real-time news. Please check configuration.",
            language: "en",
            reliability_score: 10
        }
    ];
}

/**
 * Fetch from NewsAPI as fallback
 */
async function fetchFromNewsAPI(): Promise<NewsArticle[]> {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return [];

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=venezuela&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
        );
        if (!response.ok) return [];
        const data = await response.json();
        if (!data.articles) return [];

        return data.articles.map((a: any) => ({
            title: a.title,
            title_original: a.title,
            url: a.url,
            published_at: a.publishedAt,
            source_name: a.source?.name || 'NewsAPI',
            summary: a.description || '',
            language: 'en',
            reliability_score: 7, // Default medium reliability for generic API
            category: 'International'
        }));
    } catch {
        return [];
    }
}

/**
 * Main news fetching function
 */
export async function fetchNews(): Promise<NewsArticle[]> {
    try {
        let articles = await fetchNewsFromRSS();

        if (articles.length < 5) {
            console.log("⚠️ Low RSS yield, supplementing with NewsAPI...");
            const apiArticles = await fetchFromNewsAPI();
            articles = [...articles, ...apiArticles];
        }

        if (articles.length === 0) {
            return getMockArticles();
        }

        return articles;
    } catch (error) {
        console.error("❌ News fetch failed:", error);
        return getMockArticles();
    }
}

