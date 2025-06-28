// Gemini AI service stub for chat and vision
// Replace API_KEY and endpoints with your actual Gemini API details

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_CHAT_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_VISION_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

export async function geminiChat(prompt: string): Promise<string> {
  try {
    const res = await fetch(`${GEMINI_CHAT_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
  } catch (e) {
    return 'AI service unavailable.';
  }
}

export async function geminiVision(imageBase64: string, prompt = 'What is in this image?'): Promise<string> {
  try {
    const res = await fetch(`${GEMINI_VISION_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
          ]
        }]
      }),
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
  } catch (e) {
    return 'AI service unavailable.';
  }
}
