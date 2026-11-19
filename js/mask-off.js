const chatEl = document.getElementById('mask-chat');
const form = document.getElementById('mask-form');
const input = document.getElementById('mask-input');
const transferBanner = document.getElementById('transfer-banner');
const journalButton = document.getElementById('save-mask-journal');
const clearButton = document.getElementById('clear-mask-chat');
const newChatButton = document.getElementById('new-mask-chat');
const acceptTransferButton = document.getElementById('accept-transfer');
const declineTransferButton = document.getElementById('decline-transfer');
const journalKey = 'noracle-private-journal';
const sessionKey = 'noracle-mask-session';
const transferKey = 'noracle-mask-transfer';

const state = {
  messages: JSON.parse(localStorage.getItem(sessionKey) || '[]')
};

const addMessage = (text, type) => {
  const row = document.createElement('div');
  row.className = `message ${type}`;
  row.textContent = text;
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
  state.messages.push({ text, type });
  localStorage.setItem(sessionKey, JSON.stringify(state.messages));
};

const seedConversation = () => {
  if (state.messages.length > 0) {
    state.messages.forEach((message) => {
      const row = document.createElement('div');
      row.className = `message ${message.type}`;
      row.textContent = message.text;
      chatEl.appendChild(row);
    });
    return;
  }

  addMessage('You are allowed to be human here. What part of this feels hardest to say out loud?', 'bot');
};

const buildResponse = (text) => {
  const value = text.toLowerCase();

  if (value.includes('afraid') || value.includes('scared') || value.includes('panic')) {
    return 'That sounds scary. You do not need to fix it in one breath. What feels most urgent about it right now?';
  }

  if (value.includes('tired') || value.includes('exhausted') || value.includes('overwhelmed')) {
    return 'You may be carrying more than your body or mind can hold comfortably. What part of it feels the heaviest to carry today?';
  }

  if (value.includes('ashamed') || value.includes('guilty') || value.includes('embarrassed')) {
    return 'Shame grows louder when we keep it hidden. What would feel true if you gave yourself a little more mercy?';
  }

  if (value.includes('alone') || value.includes('ignored') || value.includes('left out')) {
    return 'Being unseen hurts. What do you wish someone understood without you having to explain everything?';
  }

  return 'Thank you for saying that plainly. What do you notice in your body when that thought is present?';
};

const showTransferPrompt = () => {
  const alreadyVisible = !transferBanner.classList.contains('hidden');
  if (!alreadyVisible) {
    transferBanner.classList.remove('hidden');
  }
};

const saveToJournal = () => {
  const inputValue = input.value.trim();
  const journalEntries = JSON.parse(localStorage.getItem(journalKey) || '[]');
  const note = inputValue || (state.messages.length ? state.messages[state.messages.length - 1].text : '');

  if (!note) return;

  journalEntries.push({
    createdAt: new Date().toISOString(),
    text: note,
    type: 'private-journal'
  });

  localStorage.setItem(journalKey, JSON.stringify(journalEntries));
  const status = document.createElement('div');
  status.className = 'inline-status';
  status.textContent = 'Saved to your private journal.';
  chatEl.appendChild(status);
  chatEl.scrollTop = chatEl.scrollHeight;
  input.value = '';
};

const resetConversation = () => {
  state.messages = [];
  localStorage.removeItem(sessionKey);
  chatEl.innerHTML = '';
  transferBanner.classList.add('hidden');
  addMessage('You are allowed to be human here. What feels honest to say now?', 'bot');
};

const storeTransfer = () => {
  const payload = {
    title: 'Mask Off reflection',
    description: state.messages.filter((entry) => entry.type === 'user').slice(-1)[0]?.text || 'A private reflection',
    category: 'Self-worth',
    intensity: 'Moderate',
    duration: 'Recently',
    context: 'Transferred from Mask Off with consent.'
  };

  localStorage.setItem(transferKey, JSON.stringify(payload));
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();

  if (!value) return;

  addMessage(value, 'user');
  input.value = '';

  window.setTimeout(() => {
    const reply = buildResponse(value);
    addMessage(reply, 'bot');
    showTransferPrompt();
  }, 300);
});

journalButton.addEventListener('click', saveToJournal);
clearButton.addEventListener('click', () => {
  if (window.confirm('Clear this conversation?')) {
    resetConversation();
  }
});
newChatButton.addEventListener('click', resetConversation);

acceptTransferButton.addEventListener('click', () => {
  storeTransfer();
  transferBanner.classList.add('hidden');
  window.location.href = 'emotional-backpack.html';
});

declineTransferButton.addEventListener('click', () => {
  transferBanner.classList.add('hidden');
});

[...document.querySelectorAll('.prompt-chip')].forEach((chip) => {
  chip.addEventListener('click', () => {
    input.value = chip.textContent.trim();
    input.focus();
  });
});

seedConversation();
