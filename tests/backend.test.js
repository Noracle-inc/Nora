const test = require('node:test');
const assert = require('node:assert/strict');
const {
  RequestError, validateRequest, handleAssistantRequest, crisisResponse
} = require('../backend/routes/assistant');
const { authenticateRequest, AuthenticationError } = require('../backend/services/firebase-auth');

test('assistant request requires a bounded non-empty message', () => {
  assert.throws(() => validateRequest({ message: '  ' }), RequestError);
  assert.throws(() => validateRequest({ message: 'x'.repeat(8001) }), (error) => error.status === 413);
  assert.equal(validateRequest({ message: ' hello ' }).message, 'hello');
});

test('assistant history is bounded and role-ordered', () => {
  assert.throws(() => validateRequest({ message: 'hello', uid: 'another-user' }), RequestError);
  assert.throws(() => validateRequest({ message: 'hello', history: Array(11).fill({ role: 'user', content: 'hi' }) }), RequestError);
  assert.throws(() => validateRequest({
    message: 'hello',
    history: [{ role: 'assistant', content: 'Hi' }]
  }), RequestError);
  assert.deepEqual(validateRequest({
    message: 'next',
    history: [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Hello' }]
  }).history.map((item) => item.role), ['user', 'assistant']);
});

test('crisis signal returns local support handoff without calling Claude', async () => {
  const result = await handleAssistantRequest({ message: 'I want to kill myself' }, 'test-user');
  assert.deepEqual(result.safety, { level: 'urgent', handoffRequired: true });
  assert.match(result.reply, /local emergency services/i);
  assert.doesNotMatch(result.reply, /\+?\d{3,}/);
  assert.deepEqual(crisisResponse(), result);
  const historyResult = await handleAssistantRequest({
    message: 'Can you help me with something else?',
    history: [{ role: 'user', content: 'I might hurt myself' }, { role: 'assistant', content: 'I hear you.' }]
  }, 'test-user');
  assert.equal(historyResult.safety.level, 'urgent');
});

test('ordinary assistant requests fail closed while provider is unconfigured', async () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  const originalModel = process.env.CLAUDE_MODEL;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.CLAUDE_MODEL;
  try {
    await assert.rejects(handleAssistantRequest({ message: 'I had a difficult day.' }, 'test-user'), (error) => (
      error.status === 503 && error.code === 'assistant_not_configured'
    ));
  } finally {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.CLAUDE_MODEL;
    else process.env.CLAUDE_MODEL = originalModel;
  }
});

test('backend refuses requests without Firebase bearer tokens', async () => {
  await assert.rejects(authenticateRequest({ headers: {} }), (error) => (
    error instanceof AuthenticationError && error.status === 401
  ));
});
