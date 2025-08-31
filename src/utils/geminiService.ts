// Use a server-side proxy endpoint to call Gemini securely.
// Frontend calls /api/gemini with { prompt } and the serverless function forwards to Gemini.

// Try the serverless proxy first (/api/gemini). If it returns 404 (not present during local dev),
// fallback to calling Gemini directly using VITE_GEMINI_API_KEY (only for local development).

const GEMINI_PROXY_PATH = '/api/gemini';
const LOCAL_PROXY = 'http://localhost:3000/api/gemini'; // Vercel dev typically serves at :3000
const VITE_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY;

async function callProxy(prompt: string, url = GEMINI_PROXY_PATH) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return res;
}

async function callDirectGemini(prompt: string) {
  if (!VITE_KEY) throw new Error('VITE_GEMINI_API_KEY not set for direct call');

  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.2
    }
  };

  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${VITE_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return r;
}

export async function askGemini(prompt: string): Promise<string> {
  try {
    // First try proxy
    try {
      const proxyRes = await callProxy(prompt, GEMINI_PROXY_PATH);
      if (proxyRes.ok) {
        const data = await proxyRes.json();
        return data?.text || JSON.stringify(data?.raw || data);
      }

      // If proxy returns 404 specifically, try local dev proxy next
      if (proxyRes.status === 404) {
        try {
          const localRes = await callProxy(prompt, LOCAL_PROXY);
          if (localRes.ok) {
            const data = await localRes.json();
            return data?.text || JSON.stringify(data?.raw || data);
          }
          // If local also fails, continue to fallback
        } catch (localErr) {
          console.warn('Local proxy attempt failed:', localErr);
        }
      }

      if (proxyRes.status !== 404) {
        const errText = await proxyRes.text();
        throw new Error(`Proxy error: ${proxyRes.status} ${errText}`);
      }
    } catch (proxyErr: any) {
      // If it's not a 404, warn and attempt direct call if possible
      if (proxyErr?.message && !/404/.test(String(proxyErr))) {
        console.warn('Proxy call failed, will attempt direct call if VITE key is present:', proxyErr);
      }
    }

    // Fallback: direct call using VITE key (local dev only)
    if (VITE_KEY) {
      const directRes = await callDirectGemini(prompt);
      if (!directRes.ok) {
        const err = await directRes.text();
        throw new Error(`Direct Gemini error: ${directRes.status} ${err}`);
      }
      const data = await directRes.json();
      // Extract text using the new API format
      let text = '';
      if (data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts)) {
          text = candidate.content.parts
            .map((part: any) => part.text || '')
            .filter(Boolean)
            .join('\n');
        }
      }
      if (!text) {
        text = data?.text || data?.outputText || data?.generatedText || JSON.stringify(data);
      }
      return text;
    }

    throw new Error('Gemini proxy unavailable and VITE_GEMINI_API_KEY not provided.');
  } catch (err: any) {
    console.error('Gemini proxy error:', err);
    throw err;
  }
}

// Example: Use this function in your app
// const answer = await askGemini("What crop is best for clay soil in Kharif season?");
