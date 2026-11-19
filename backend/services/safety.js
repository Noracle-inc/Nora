// Lightweight signal only; it is not clinical risk assessment or a replacement for human support.
const CRISIS_PATTERN = /\b(?:suicid(?:e|al)|kill(?:ing)? myself|end my life|self[- ]harm|hurt myself|harm myself|not safe (?:with|from) myself)\b/i;

function triage({ message = '', history = [] } = {}) {
  const urgent = CRISIS_PATTERN.test(message)
    || history.some((item) => item.role === 'user' && CRISIS_PATTERN.test(item.content || ''));
  return { level: urgent ? 'urgent' : 'none', mode: urgent ? 'support-handoff' : 'normal' };
}

module.exports = { triage, CRISIS_PATTERN };
