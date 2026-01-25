import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useDashboardData() {
    const [news, setNews] = useState<any[]>([]);
    const [analysis, setAnalysis] = useState<any>(null);
    const [oilPrices, setOilPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Latest News (Extended to 100 for richer display)
            const { data: newsData } = await supabase
                .from('news')
                .select('*')
                .order('published_at', { ascending: false })
                .limit(100);

            if (newsData) setNews(newsData);

            // 2. Fetch Latest Analysis
            const { data: analysisData } = await supabase
                .from('analyses')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(1)
                .single();

            if (analysisData) {
                setAnalysis({
                    flash: analysisData.flash_json,
                    report: analysisData.report_json,
                    alerts: analysisData.alerts_json,
                    timestamp: analysisData.timestamp
                });
            }


            // 3. Fetch Oil Prices (Extended for 30-day detailed chart)
            const { data: oilData } = await supabase
                .from('oil_prices')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(200); // Show 30 days of price history

            if (oilData && oilData.length > 0) {
                // Transform data: Group BRENT and WTI by timestamp
                const grouped = new Map();

                oilData.forEach((record: any) => {
                    const ts = record.timestamp;
                    if (!grouped.has(ts)) {
                        grouped.set(ts, { timestamp: ts });
                    }
                    const entry = grouped.get(ts);

                    if (record.symbol === 'BRENT') {
                        entry.brent = record.price;
                        entry.brent_change = record.change_percent;
                    } else if (record.symbol === 'WTI') {
                        entry.wti = record.price;
                        entry.wti_change = record.change_percent;
                    }
                });

                // Convert to array and filter incomplete entries
                const combined = Array.from(grouped.values())
                    .filter((entry: any) => entry.brent && entry.wti)
                    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                setOilPrices(combined);
            }

            setLastUpdate(new Date());


        } catch (error) {
            console.error("Dashboard Data Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Initial load

        // Auto-refresh every hour
        const refreshInterval = setInterval(() => {
            console.log('🔄 Auto-refresh: Fetching new data...');
            fetchData();
        }, 60 * 60 * 1000); // 1 hour = 3600000 ms

        // Realtime Subscription (Optional bonus)
        const subscription = supabase
            .channel('dashboard')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analyses' }, (payload) => {
                console.log('New analysis received!', payload);
                fetchData(); // Refresh all on new analysis
            })
            .subscribe();

        return () => {
            clearInterval(refreshInterval);
            subscription.unsubscribe();
        };
    }, []);

    return { news, analysis, oilPrices, loading, lastUpdate, refreshData: fetchData };
}

