import { observeAuth } from './auth.js';
import { createJournalEntry, listJournalEntries } from './firestore-data.js';

const form = document.getElementById('journal-form');
const titleInput = document.getElementById('journal-title');
const entryInput = document.getElementById('journal-entry');
const list = document.getElementById('journal-list');
const draftBtn = document.getElementById('save-draft');
const status = document.getElementById('journal-status');
const storageKey = 'noracle-journal-entries';
const draftKey = 'noracle-journal-draft';
let currentUser = null;

const readLocalEntries = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error('Unable to read local journal entries:', error);
    return [];
  }
};

const setStatus = (message, isError = false) => {
  if (!status) return;
  status.textContent = message;
  status.setAttribute('aria-invalid', String(isError));
};

const renderEntries = (entries) => {
  list.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'entry-item';
    const title = document.createElement('strong');
    title.textContent = 'No entries yet';
    const copy = document.createElement('p');
    copy.textContent = 'Write the first honest line and let it be enough.';
    empty.append(title, copy);
    list.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const item = document.createElement('article');
    item.className = 'entry-item';
    const title = document.createElement('strong');
    title.textContent = entry.title || 'Untitled reflection';
    const text = document.createElement('p');
    text.textContent = entry.text || '';
    const date = document.createElement('small');
    const createdAt = entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt);
    date.textContent = Number.isNaN(createdAt.getTime()) ? '' : createdAt.toLocaleString();
    item.append(title, text, date);
    list.appendChild(item);
  });
};

const refreshEntries = async () => {
  if (!currentUser) {
    renderEntries(readLocalEntries());
    setStatus('Unsigned entries are saved only in this browser. Sign in to save them to your account.');
    return;
  }
  try {
    renderEntries(await listJournalEntries(50));
    setStatus('Your journal entries are private to your account.');
  } catch (error) {
    console.error('Unable to load account journal entries:', error);
    renderEntries([]);
    setStatus('Your account journal could not be loaded. Please try again.', true);
  }
};

try {
  observeAuth((user) => {
    currentUser = user;
    refreshEntries();
  });
} catch (error) {
  console.info('Firebase journal sync is unavailable:', error.message);
  renderEntries(readLocalEntries());
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const text = entryInput.value.trim();
  if (!text) {
    setStatus('Write a line before saving your entry.', true);
    return;
  }
  const entry = {
    title: (title || 'Untitled reflection').slice(0, 120),
    text: text.slice(0, 10000),
    createdAt: new Date().toISOString()
  };
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  try {
    if (currentUser) {
      await createJournalEntry(entry);
      setStatus('Entry saved to your private account.');
    } else {
      localStorage.setItem(storageKey, JSON.stringify([entry, ...readLocalEntries()]));
      setStatus('Entry saved only in this browser. Sign in to save entries to your account.');
    }
    form.reset();
    await refreshEntries();
  } catch (error) {
    console.error('Unable to save journal entry:', error);
    setStatus('Your journal entry could not be saved. Please try again.', true);
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

draftBtn?.addEventListener('click', () => {
  localStorage.setItem(draftKey, entryInput.value.trim());
  setStatus('Draft saved only in this browser.');
});

const savedDraft = localStorage.getItem(draftKey);
if (savedDraft) entryInput.value = savedDraft;

if (!currentUser) renderEntries(readLocalEntries());
