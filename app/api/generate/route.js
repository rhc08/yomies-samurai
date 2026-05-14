import { YOMIES_MENU } from '@/lib/drinks';

// Fallback drinks if API fails or key isn't set — keeps the demo working
const FALLBACK = [
  {
    name: 'The Tactical Retreat',
    drinkId: 'lions-mane-latte',
    description: 'Warm. Quiet. The taste of a closed laptop and an unread email count of one.',
    diagnosis: 'You\'re running on the fumes of a Sunday that ended too soon. Permission granted to slow down.',
  },
  {
    name: 'Mid-Meeting Sedative',
    drinkId: 'ashwagandha-latte',
    description: 'Velvety, grounding, and gently insulting to your calendar.',
    diagnosis: 'Three meetings deep, six to go. We\'ve added something to take the edge off the agenda.',
  },
  {
    name: 'Sunday Apologist',
    drinkId: 'cold-brew',
    description: 'Cold, unbothered, and unwilling to participate in any further small talk.',
    diagnosis: 'You\'re not late. The week started without you. We respect that.',
  },
];

function getTimeContext() {
  // UAE timezone offset is +4
  const now = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const hour = now.getUTCHours();
  const day = now.getUTCDay();
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];

  let timeOfDay;
  if (hour < 6) timeOfDay = 'pre-dawn';
  else if (hour < 11) timeOfDay = 'morning';
  else if (hour < 14) timeOfDay = 'midday';
  else if (hour < 17) timeOfDay = 'afternoon';
  else if (hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'late night';

  return { dayName, timeOfDay, hour };
}

export async function POST(req) {
  try {
    const { confession } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ drinks: FALLBACK, source: 'fallback' });
    }

    const { dayName, timeOfDay, hour } = getTimeContext();

    const menuList = YOMIES_MENU
      .map((d) => `- ${d.id}: ${d.name} (${d.vibe})`)
      .join('\n');

    const prompt = `You are the witty, playful, slightly sarcastic voice of Yomies — a Dubai-based premium coffee and functional smoothie brand. Yomies celebrates individuality: no person is the same, no drink is the same.

Someone in Dubai just opened the Yomies tile inside a delivery app. They typed this one-line confession about their day:

"${confession}"

Current context: it's ${dayName} ${timeOfDay} (${hour}:00) in Dubai.

Your job: invent 3 one-of-one drink "naming experiences" tailored specifically to this confession. Each must:

1. Have a NAME that's funny, oddly specific, and feels written FOR this person, this moment. Names should feel like inside jokes — not generic ("Energy Boost") but pointed ("Mid-Meeting Sedative", "The Eldest Daughter's Espresso", "Q4 Survival Protocol"). Capitalize like a title.

2. Map to a real Yomies menu item by drinkId. Choose drinkIds wisely — match the vibe of the name to the vibe of the actual product. Available menu:

${menuList}

3. Have a 1-2 line sensory description in Yomies' voice: playful, witty, never preachy. Talk about how it tastes and feels, not what's in it.

4. Have a "diagnosis" — a 1-2 line read of the confession in Yomies' voice. Gently funny, knowing, slightly roasting but kind. Like a friend who really sees you.

Make the three drinks meaningfully different from each other (e.g., one comforting, one assertive, one indulgent). Avoid clichés. Avoid the word "perfect". Avoid wellness-influencer language.

Return ONLY valid JSON, no markdown fences, no commentary. Structure:
{"drinks":[{"name":"...","drinkId":"...","description":"...","diagnosis":"..."},{"name":"...","drinkId":"...","description":"...","diagnosis":"..."},{"name":"...","drinkId":"...","description":"...","diagnosis":"..."}]}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 1.1,
            topP: 0.95,
            maxOutputTokens: 1500,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return Response.json({ drinks: FALLBACK, source: 'fallback', error: 'api_error' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return Response.json({ drinks: FALLBACK, source: 'fallback', error: 'no_text' });
    }

    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed?.drinks || !Array.isArray(parsed.drinks) || parsed.drinks.length === 0) {
      return Response.json({ drinks: FALLBACK, source: 'fallback', error: 'bad_shape' });
    }

    // Validate drinkIds exist
    const validIds = new Set(YOMIES_MENU.map((d) => d.id));
    const validated = parsed.drinks.map((drink) => ({
      ...drink,
      drinkId: validIds.has(drink.drinkId) ? drink.drinkId : YOMIES_MENU[0].id,
    }));

    return Response.json({ drinks: validated.slice(0, 3), source: 'gemini' });
  } catch (e) {
    console.error('Generation error:', e);
    return Response.json({ drinks: FALLBACK, source: 'fallback', error: 'exception' });
  }
}
