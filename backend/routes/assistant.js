const MAX_MESSAGE_LENGTH = 8000;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_MESSAGE_LENGTH = 4000;
const { routeRequest } = require('../services/ai');
const { triage } = require('../services/safety');

class RequestError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
    this.code = code;
  }
}

function validateRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)
    || Object.keys(body).some((key) => !['message', 'history'].includes(key))) {
    throw new RequestError(400, 'invalid_body', 'Request must contain only message and optional history fields.');
  }
  if (typeof body.message !== 'string' || !body.message.trim()) {
    throw new RequestError(400, 'invalid_message', 'message must be a non-empty string.');
  }
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    throw new RequestError(413, 'message_too_long', `message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
  }
  const history = body.history === undefined ? [] : body.history;
  if (!Array.isArray(history) || history.length > MAX_HISTORY_ITEMS) {
    throw new RequestError(400, 'invalid_history', `history must contain at most ${MAX_HISTORY_ITEMS} messages.`);
  }
  const cleanHistory = history.map((item, index) => {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string'
      || !item.content.trim() || item.content.length > MAX_HISTORY_MESSAGE_LENGTH) {
      throw new RequestError(400, 'invalid_history', 'Each history item needs a user/assistant role and bounded content.');
    }
    if (index === 0 && item.role !== 'user') {
      throw new RequestError(400, 'invalid_history', 'History must begin with a user message and alternate roles.');
    }
    if (index > 0 && item.role === history[index - 1].role) {
      throw new RequestError(400, 'invalid_history', 'History must alternate user and assistant messages.');
    }
    return { role: item.role, content: item.content };
  });
  if (cleanHistory.length && cleanHistory[cleanHistory.length - 1].role !== 'assistant') {
    throw new RequestError(400, 'invalid_history', 'History must end with an assistant message before the new user message.');
  }
  return { message: body.message.trim(), history: cleanHistory };
}

function crisisResponse() {
  return {
    reply: 'I’m sorry you’re facing this. I’m an AI, not emergency support. If you may act on these thoughts or are in immediate danger, contact your local emergency services now or go to the nearest emergency department. If you can, tell someone you trust and ask them to stay with you. I can stay with you here while you reach out.',
    safety: { level: 'urgent', handoffRequired: true }
  };
}

async function handleAssistantRequest(body, _uid) {
  const input = validateRequest(body);
  if (triage({ message: input.message, history: input.history }).level === 'urgent') return crisisResponse();
  const reply = await routeRequest(input);
  return { reply, safety: { level: 'standard', handoffRequired: false } };
}

module.exports = { RequestError, validateRequest, handleAssistantRequest, crisisResponse };
