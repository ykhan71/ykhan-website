export async function onRequest(context) {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600'
  };

  const apiKey = context.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'FINNHUB_API_KEY not set in Cloudflare environment variables.' }), {
      status: 500, headers: corsHeaders
    });
  }

  const tickers = ['AMD', 'NVDA', 'AVGO', 'LRCX', 'SKHY'];
  const to   = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  try {
    const results = await Promise.all(
      tickers.map(ticker =>
        fetch(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${apiKey}`)
          .then(r => r.ok ? r.json() : [])
          .then(articles => Array.isArray(articles)
            ? articles.slice(0, 4).map(a => ({
                ticker,
                datetime: a.datetime,
                headline: a.headline,
                source:   a.source,
                url:      a.url,
                summary:  a.summary
              }))
            : []
          )
          .catch(() => [])
      )
    );

    const articles = results
      .flat()
      .filter(a => a.headline && a.url)
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, 10);

    return new Response(JSON.stringify(articles), { headers: corsHeaders });

  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
}
