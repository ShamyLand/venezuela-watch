import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useDashboardData() {
    const [news, setNews] = useState<any[]>([]);
    const [analysis, setAnalysis] = useState<any>(null);
    const [oilPrices, setOilPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // 1. Fetch Latest News (Limit 20)
                const { data: newsData } = await supabase
                    .from('news')
                    .select('*')
                    .order('published_at', { ascending: false })
                    .limit(20);

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

                // 3. Fetch Oil Prices
                // For simple chart, we might need to fetch history. For now just latest.
                const { data: oilData } = await supabase
                    .from('oil_prices')
                    .select('*')
                    .order('timestamp', { ascending: false })
                    .limit(2); // Get latest Brent & WTI

                if (oilData) setOilPrices(oilData);

            } catch (error) {
                console.error("Dashboard Data Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        // Realtime Subscription (Optional bonus)
        const subscription = supabase
            .channel('dashboard')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analyses' }, (payload) => {
                console.log('New analysis received!', payload);
                fetchData(); // Refresh all on new analysis
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { news, analysis, oilPrices, loading };
}
