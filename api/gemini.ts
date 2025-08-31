// Serverless proxy for Gemini API (Vercel compatible)
// Uses standard Request/Response types instead of @vercel/node

interface RequestBody {
  prompt?: string;
  input?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  const body: RequestBody = req.body || {};
  const prompt = body.prompt || body.input || '';
  if (!prompt) {
    return res.status(400).json({ error: 'prompt required in request body' });
  }

  try {
    // Updated to use the correct Gemini API endpoint with API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.2,
      }
    };

    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('Gemini API error:', data);
      return res.status(r.status || 500).json({ error: 'Gemini API error', detail: data });
    }

    // Extract text from the new API response format
    const text = extractTextFromGeminiResponse(data);

    return res.status(200).json({ text, raw: data });
  } catch (err: any) {
    console.error('Gemini proxy error:', err);
    return res.status(500).json({ error: 'internal_error', detail: String(err) });
  }
}

function extractTextFromGeminiResponse(data: any): string {
  try {
    if (!data) return '';
    
    // New Gemini API response format
    if (data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts)) {
        return candidate.content.parts
          .map((part: any) => part.text || '')
          .filter(Boolean)
          .join('\n');
      }
    }

    // Legacy format fallbacks
    if (data?.text) return data.text;
    if (data?.generatedText) return data.generatedText;
    if (data?.outputText) return data.outputText;

    return JSON.stringify(data);
  } catch (e) {
    return JSON.stringify(data);
  }
}
