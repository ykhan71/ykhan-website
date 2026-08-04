export async function onRequest(context) {
  const ticker = context.params.ticker.toUpperCase();

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300'
  };

  try {
    const fetchOpts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    };

    // Fetch 1y for historical periods + 1d range to reliably get previous close
    const [res1y, res1d] = await Promise.all([
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y`, fetchOpts),
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`, fetchOpts)
    ]);

    if (!res1y.ok) throw new Error(`Yahoo returned ${res1y.status}`);

    const data = await res1y.json();
    const data1d = res1d.ok ? await res1d.json() : null;

    const result = data?.chart?.result?.[0];
    if (!result) throw new Error('No data');

    const meta = result.meta;
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    const currentPrice = meta.regularMarketPrice;

    // Previous close: chartPreviousClose from a 1d-range request = yesterday's close
    const prevClose1D = data1d?.chart?.result?.[0]?.meta?.chartPreviousClose || null;

    // Exclude today's incomplete candle from all other period lookups
    const todayStart = new Date().setHours(0, 0, 0, 0) / 1000;

    // Find closing price N calendar days ago (excluding today's incomplete candle)
    function priceNDaysAgo(days) {
      const target = (Date.now() / 1000) - (days * 86400);
      let best = null, bestDiff = Infinity;
      for (let i = 0; i < timestamps.length; i++) {
        if (closes[i] === null || timestamps[i] >= todayStart) continue;
        const diff = Math.abs(timestamps[i] - target);
        if (diff < bestDiff) { bestDiff = diff; best = closes[i]; }
      }
      return best;
    }

    // YTD: first trading day of current year
    function ytdPrice() {
      const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime() / 1000;
      let best = null, bestDiff = Infinity;
      for (let i = 0; i < timestamps.length; i++) {
        if (closes[i] === null || timestamps[i] < yearStart) continue;
        const diff = timestamps[i] - yearStart;
        if (diff < bestDiff) { bestDiff = diff; best = closes[i]; }
      }
      return best;
    }

    function delta(past) {
      if (!past) return null;
      return {
        dollar: parseFloat((currentPrice - past).toFixed(2)),
        percent: parseFloat(((currentPrice - past) / past * 100).toFixed(2)),
        past: parseFloat(past.toFixed(2))
      };
    }

    // Extended hours
    const marketState = meta.marketState || 'CLOSED';
    const postMarketPrice = meta.postMarketPrice ? parseFloat(meta.postMarketPrice.toFixed(2)) : null;
    const postMarketChange = meta.postMarketChange ? parseFloat(meta.postMarketChange.toFixed(2)) : null;
    const postMarketChangePercent = meta.postMarketChangePercent ? parseFloat(meta.postMarketChangePercent.toFixed(2)) : null;
    const preMarketPrice = meta.preMarketPrice ? parseFloat(meta.preMarketPrice.toFixed(2)) : null;
    const preMarketChange = meta.preMarketChange ? parseFloat(meta.preMarketChange.toFixed(2)) : null;
    const preMarketChangePercent = meta.preMarketChangePercent ? parseFloat(meta.preMarketChangePercent.toFixed(2)) : null;

    return new Response(JSON.stringify({
      ticker,
      price: parseFloat(currentPrice.toFixed(2)),
      currency: meta.currency || 'USD',
      name: meta.longName || meta.shortName || ticker,
      marketState,
      postMarketPrice,
      postMarketChange,
      postMarketChangePercent,
      preMarketPrice,
      preMarketChange,
      preMarketChangePercent,
      '1D': delta(prevClose1D),
      '1W': delta(priceNDaysAgo(7)),
      '1M': delta(priceNDaysAgo(30)),
      '3M': delta(priceNDaysAgo(90)),
      '6M': delta(priceNDaysAgo(180)),
      'YTD': delta(ytdPrice()),
      '1Y': delta(priceNDaysAgo(365))
    }), { headers: corsHeaders });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: corsHeaders
    });
  }
}
