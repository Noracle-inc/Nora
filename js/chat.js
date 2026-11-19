import { observeAuth, requestAssistant } from './auth.js';
import { firebaseConfigured } from './firebase-config.js';
import {
  appendConversationMessage,
  createConversation,
  listConversationMessages,
  listConversations
} from './firestore-data.js';

const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messages = document.getElementById('chat-messages');
const status = document.getElementById('chat-status');
const conversationList = document.getElementById('conversation-list');
let conversationId = null;
let history = [];
let currentUser = null;

const addMessage = (text, type) => {
  const row = document.createElement('div');
  row.className = `message ${type}`;
  row.textContent = text;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
};

const clearMessages = () => {
  messages.replaceChildren();
};

const canSaveHistory = () => {
  if (!firebaseConfigured || !currentUser) return false;
  try {
    const settings = JSON.parse(localStorage.getItem('noracle-settings') || '{}');
    return settings.memory === true && settings.privacyMode !== 'private';
  } catch (error) {
    console.error('Unable to read conversation privacy settings:', error);
    return false;
  }
};

const renderConversationList = async () => {
  if (!conversationList) return;
  if (!canSaveHistory()) {
    conversationList.replaceChildren();
    return;
  }
  try {
    const conversations = await listConversations(50);
    conversationList.replaceChildren();
    conversations.forEach((conversation) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn ghost';
      button.textContent = conversation.title || 'Reflection';
      button.addEventListener('click', () => openConversation(conversation.id));
      item.appendChild(button);
      conversationList.appendChild(item);
    });
  } catch (error) {
    console.error('Unable to load saved conversations:', error);
    if (status) status.textContent = 'Your saved conversations could not be loaded.';
  }
};

const openConversation = async (id) => {
  try {
    const storedMessages = await listConversationMessages(id, 100);
    conversationId = id;
    const turns = storedMessages.map(({ role, content }) => ({ role, content }));
    while (turns[0]?.role === 'assistant') turns.shift();
    if (turns.at(-1)?.role === 'user') turns.pop();
    if (turns.length % 2 !== 0) turns.shift();
    history = turns.slice(-10);
    clearMessages();
    storedMessages.forEach(({ role, content }) => addMessage(content, role === 'assistant' ? 'bot' : 'user'));
    if (status) status.textContent = 'Loaded a saved conversation from your account.';
  } catch (error) {
    console.error('Unable to open saved conversation:', error);
    if (status) status.textContent = 'That conversation could not be opened.';
  }
};

document.getElementById('new-chat')?.addEventListener('click', () => {
  conversationId = null;
  history = [];
  clearMessages();
  addMessage('Hello, you. Want to tell me what feels heavy right now?', 'bot');
  if (status) {
    status.textContent = canSaveHistory()
      ? 'This conversation will be saved to your account history.'
      : 'Messages are not saved to your account unless you enable conversation history in Settings.';
  }
});

renderConversationList();
if (!firebaseConfigured && status) {
  status.textContent = 'Firebase is not configured for this deployment. Sign-in and AI chat are unavailable until setup is complete.';
} else {
  try {
    observeAuth((user) => {
      currentUser = user;
      if (!user && status) {
        status.textContent = 'Sign in to talk with Nora. Conversation history remains off unless you opt in through Settings.';
      } else if (user) {
        status.textContent = canSaveHistory()
          ? 'Conversation history is enabled for your account.'
          : 'Your messages are not saved to your account unless you enable conversation history in Settings.';
        renderConversationList();
      }
    });
  } catch (error) {
    console.error('Unable to check sign-in status:', error);
    if (status) status.textContent = 'Sign-in status could not be checked. Please reload and try again.';
  }
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  addMessage(value, 'user');
  input.value = '';
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  if (status) status.textContent = 'Nora is responding…';

  try {
    const result = await requestAssistant(value, history);
    history = [...history, { role: 'user', content: value }, { role: 'assistant', content: result.reply }].slice(-10);
    addMessage(result.reply, 'bot');

    if (canSaveHistory()) {
      try {
        if (!conversationId) {
          const conversation = await createConversation(value.slice(0, 120));
          conversationId = conversation.id;
        }
        await appendConversationMessage(conversationId, { role: 'user', content: value });
        await appendConversationMessage(conversationId, { role: 'assistant', content: result.reply });
        if (status) status.textContent = 'This conversation was saved to your account.';
        await renderConversationList();
      } catch (error) {
        console.error('Unable to save conversation history:', error);
        if (status) status.textContent = 'Nora replied, but this conversation could not be saved to your account.';
      }
    } else if (status) {
      status.textContent = currentUser
        ? 'This conversation is not saved to your account.'
        : 'Sign in to continue. This conversation is not saved to your account.';
    }

    if (result.safety?.handoffRequired && status) {
      status.textContent = 'If you may be in immediate danger, contact local emergency services or a trusted person now.';
    }
  } catch (error) {
    console.error('Assistant request failed:', error);
    addMessage(error.message || 'The assistant is unavailable. Please try again later.', 'bot');
    if (status) status.textContent = error.code === 'assistant_not_configured'
      ? 'The AI service is not configured for this deployment.'
      : 'Your message could not be sent. Please check that you are signed in and try again.';
  } finally {
    if (submitButton) submitButton.disabled = false;
    input.focus();
  }
});
