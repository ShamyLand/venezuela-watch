const NEWS_API_KEY = process.env.NEWS_API_KEY;

export interface NewsItem {
    title: string;
    source: string;
    url: string;
    publishedAt: string;
    description?: string;
}

export async function fetchNews() {
    if (!NEWS_API_KEY) {
        console.warn("NEWS_API_KEY is missing");
        return [];
    }

    const query = "(Venezuela OR Maduro OR PDVSA) AND (oil OR pétrole OR sanctions OR USA)";
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== 'ok') {
            throw new Error(data.message);
        }

        return data.articles.map((article: any) => ({
            title: article.title,
            source: article.source.name,
            url: article.url,
            publishedAt: article.publishedAt,
            description: article.description
        }));
    } catch (error) {
        console.error("News Fetch Error:", error);
        return [];
    }
}
