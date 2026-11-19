import { observeAuth } from './auth.js';
import { createMoodEntry, listMoodEntries } from './firestore-data.js';

const buttons = [...document.querySelectorAll('.mood-pill[data-mood]')];
const saveButton = document.getElementById('save-mood');
const noteInput = document.getElementById('mood-note');
const status = document.getElementById('mood-status');
const historyList = document.getElementById('mood-history-list');
const storageKey = 'noracle-mood-entries';
let selectedMood = null;
let currentUser = null;

const readLocalEntries = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error('Unable to read local mood check-ins:', error);
    return [];
  }
};

const setStatus = (message, isError = false) => {
  status.textContent = message;
  status.setAttribute('aria-invalid', String(isError));
};

const renderHistory = (entries) => {
  historyList.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('li');
    empty.textContent = 'No check-ins yet. Choose the word that best fits today.';
    historyList.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const item = document.createElement('li');
    const label = buttons.find((button) => button.dataset.mood === entry.mood)?.textContent || entry.mood;
    const date = entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt);
    item.textContent = `${label}${Number.isNaN(date.getTime()) ? '' : ` · ${date.toLocaleString()}`}${entry.note ? ` — ${entry.note}` : ''}`;
    historyList.appendChild(item);
  });
};

const refreshHistory = async () => {
  if (!currentUser) {
    renderHistory(readLocalEntries());
    setStatus('Unsigned mood check-ins are saved only in this browser.');
    return;
  }
  try {
    renderHistory(await listMoodEntries(100));
    setStatus('Your mood check-ins are private to your account.');
  } catch (error) {
    console.error('Unable to load account mood check-ins:', error);
    renderHistory([]);
    setStatus('Your account mood check-ins could not be loaded. Please try again.', true);
  }
};

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedMood = button.dataset.mood;
    buttons.forEach((pill) => {
      const selected = pill === button;
      pill.classList.toggle('is-selected', selected);
      pill.setAttribute('aria-pressed', String(selected));
    });
    saveButton.disabled = false;
  });
  button.setAttribute('aria-pressed', 'false');
});

saveButton.addEventListener('click', async () => {
  if (!selectedMood) return;
  const entry = {
    mood: selectedMood,
    note: noteInput.value.trim().slice(0, 1000),
    createdAt: new Date().toISOString()
  };
  saveButton.disabled = true;
  try {
    if (currentUser) {
      await createMoodEntry(entry);
      setStatus('Mood check-in saved to your private account.');
    } else {
      localStorage.setItem(storageKey, JSON.stringify([entry, ...readLocalEntries()]));
      setStatus('Mood check-in saved only in this browser.');
    }
    noteInput.value = '';
    selectedMood = null;
    buttons.forEach((button) => {
      button.classList.remove('is-selected');
      button.setAttribute('aria-pressed', 'false');
    });
    await refreshHistory();
  } catch (error) {
    console.error('Unable to save mood check-in:', error);
    setStatus('Your mood check-in could not be saved. Please try again.', true);
    saveButton.disabled = false;
  }
});

try {
  observeAuth((user) => {
    currentUser = user;
    refreshHistory();
  });
} catch (error) {
  console.info('Firebase mood sync is unavailable:', error.message);
  renderHistory(readLocalEntries());
}

if (!currentUser) renderHistory(readLocalEntries());
