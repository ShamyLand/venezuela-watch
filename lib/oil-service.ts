const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY;

export async function fetchOilPrice(symbol: 'BRENT' | 'WTI') {
    // Alpha Vantage uses specific symbols like 'BRENT' is not directly available in standard stock endpoints usually, 
    // but often 'CL=F' (WTI) / 'BZ=F' (Brent) logic applies for Yahoo. 
    // For Alpha Vantage COMMODITIES API: function=BRENT / function=WTI

    if (!ALPHA_VANTAGE_KEY) return null;

    const type = symbol === 'BRENT' ? 'BRENT' : 'WTI';
    const url = `https://www.alphavantage.co/query?function=${type}&interval=daily&apikey=${ALPHA_VANTAGE_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        // Alpha Vantage returns data: { "name": "Brent Crude Oil", "interval": "daily", "unit": "dollars per barrel", "data": [ ... ] }
        if (data.data && data.data.length > 0) {
            return {
                price: parseFloat(data.data[0].value),
                date: data.data[0].date
            };
        }
        return null;
    } catch (error) {
        console.error(`Oil Fetch Error (${symbol}):`, error);
        return null;
    }
}
