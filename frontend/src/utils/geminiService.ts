// Simple and direct Gemini API service for local development
const GEMINI_API_KEY = "AIzaSyD7QXWH3PwuzW_vo_jm8eLPRRLdRz895fA";

console.log("Gemini service loaded, API key available:", !!GEMINI_API_KEY);

export async function askGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set");
  }

  console.log("Making direct Gemini API call...");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.2,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini API response received");

    let text = "";
    if (
      data.candidates &&
      Array.isArray(data.candidates) &&
      data.candidates.length > 0
    ) {
      const candidate = data.candidates[0];
      if (
        candidate.content &&
        candidate.content.parts &&
        Array.isArray(candidate.content.parts)
      ) {
        text = candidate.content.parts
          .map((part: { text?: string }) => part.text || "")
          .filter(Boolean)
          .join("\n");
      }
    }

    if (!text) {
      console.warn("No text extracted from Gemini response, using fallback");
      text = JSON.stringify(data);
    }

    console.log("Extracted text length:", text.length);
    return text;
  } catch (error) {
    console.error("Failed to call Gemini API:", error);
    throw error;
  }
}
