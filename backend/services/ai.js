const SYSTEM_PROMPT = [
  'You are Noracle, an AI emotional-wellness companion, not a therapist, clinician, or emergency service.',
  'Offer brief, warm, non-judgmental reflection and practical low-risk wellbeing suggestions.',
  'Do not diagnose, prescribe, claim certainty, encourage dependency, or present yourself as human.',
  'For urgent danger or possible self-harm, encourage immediate contact with local emergency services or a trusted person who can be physically present. Do not invent hotline numbers or other local resources.',
  'Do not claim that a human handoff has happened. If professional care may help, suggest seeking a qualified professional.'
].join(' ');

async function routeRequest({ message, history = [] }) {
  if (!process.env.ANTHROPIC_API_KEY || !process.env.CLAUDE_MODEL) {
    const error = new Error('Claude integration is not configured.');
    error.status = 503;
    error.code = 'assistant_not_configured';
    throw error;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL,
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: [...history, { role: 'user', content: message }]
      })
    });
    if (!response.ok) {
      const error = new Error('Claude provider returned an error.');
      error.status = 502;
      error.code = 'assistant_provider_error';
      throw error;
    }
    const payload = await response.json();
    const reply = (payload.content || [])
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n')
      .trim();
    if (!reply) {
      const error = new Error('Claude returned an empty response.');
      error.status = 502;
      error.code = 'empty_assistant_response';
      throw error;
    }
    return reply;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { routeRequest };
