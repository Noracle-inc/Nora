import { deleteAccount as deleteFirebaseAccount, observeAuth, signOutUser } from './auth.js';
import {
  getSettings as getCloudSettings,
  saveSettings as saveCloudSettings,
  getProfile,
  listJournalEntries,
  listMoodEntries,
  listConversations,
  listConversationMessages
} from './firestore-data.js';

const defaultSettings = {
  theme: 'light-starry',
  language: 'en',
  notifications: true,
  privacyMode: 'private',
  reminders: true,
  reducedMotion: false,
  memory: false
};
const settingsKey = 'noracle-settings';
const themeKey = 'noracle-theme';
const languageKey = 'noracle-language';
let currentUser = null;
let cloudReady = false;

const readSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(settingsKey) || '{}');
    return { ...defaultSettings, ...(stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}) };
  } catch (error) {
    console.error('Unable to read local settings:', error);
    return { ...defaultSettings };
  }
};

const setStatus = (message, isError = false) => {
  const status = document.getElementById('settings-status');
  if (status) {
    status.textContent = message;
    status.setAttribute('aria-invalid', String(isError));
  }
};

const setAccountStatus = (message, isError = false) => {
  const status = document.getElementById('account-status');
  if (status) {
    status.textContent = message;
    status.setAttribute('aria-invalid', String(isError));
  }
};

const applySettingsToUI = () => {
  const settings = readSettings();
  const themeSelect = document.getElementById('settings-theme');
  const languageSelect = document.getElementById('settings-language');
  const notificationsToggle = document.getElementById('settings-notifications');
  const privacyToggle = document.getElementById('settings-privacy');
  const reminderToggle = document.getElementById('settings-reminders');
  const reducedMotionToggle = document.getElementById('settings-reduced-motion');
  const memoryToggle = document.getElementById('settings-memory');

  if (themeSelect) themeSelect.value = settings.theme;
  if (languageSelect) languageSelect.value = settings.language;
  if (notificationsToggle) notificationsToggle.checked = settings.notifications;
  if (privacyToggle) privacyToggle.checked = settings.privacyMode === 'private';
  if (reminderToggle) reminderToggle.checked = settings.reminders;
  if (reducedMotionToggle) reducedMotionToggle.checked = settings.reducedMotion;
  if (memoryToggle) {
    memoryToggle.checked = settings.memory && settings.privacyMode !== 'private';
    memoryToggle.disabled = settings.privacyMode === 'private';
  }
};

const applySharedPreferences = (settings) => {
  if (window.NoraclePreferences) {
    window.NoraclePreferences.setTheme(settings.theme);
    window.NoraclePreferences.setLanguage(settings.language);
  }
  document.documentElement.classList.toggle('user-reduced-motion', settings.reducedMotion);
};

const accountButtons = ['export-data', 'sign-out', 'delete-account']
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const setAccountControlsEnabled = (enabled) => {
  accountButtons.forEach((button) => { button.disabled = !enabled; });
};

try {
  observeAuth(async (user) => {
    currentUser = user;
    cloudReady = Boolean(user);
    setAccountControlsEnabled(Boolean(user));

    if (!user) {
      setAccountStatus('Signed out. Sign in to manage cloud data.');
      return;
    }

    setAccountStatus(`Signed in as ${user.email || 'your account'}.`);
    try {
      const savedSettings = await getCloudSettings();
      const settings = savedSettings ? { ...defaultSettings, ...savedSettings } : { ...defaultSettings };
      localStorage.setItem(settingsKey, JSON.stringify(settings));
      localStorage.setItem(themeKey, settings.theme);
      localStorage.setItem(languageKey, settings.language);
      applySettingsToUI();
      applySharedPreferences(settings);
    } catch (error) {
      console.error('Unable to load account settings:', error);
      setAccountStatus('Signed in, but cloud settings could not be loaded. Please try again.', true);
    }
  });
} catch (error) {
  setAccountControlsEnabled(false);
  setAccountStatus('Cloud account controls are unavailable until Firebase is configured. Local preferences still work.');
  console.info('Firebase settings sync is unavailable:', error.message);
}

const form = document.getElementById('settings-form');
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const previous = readSettings();
    const themeSelect = document.getElementById('settings-theme');
    const languageSelect = document.getElementById('settings-language');
    const notificationsToggle = document.getElementById('settings-notifications');
    const privacyToggle = document.getElementById('settings-privacy');
    const reminderToggle = document.getElementById('settings-reminders');
    const reducedMotionToggle = document.getElementById('settings-reduced-motion');
    const memoryToggle = document.getElementById('settings-memory');
    const settings = {
      ...previous,
      theme: themeSelect?.value || previous.theme,
      language: languageSelect?.value || previous.language,
      notifications: notificationsToggle?.checked ?? previous.notifications,
      privacyMode: privacyToggle?.checked ? 'private' : 'standard',
      reminders: reminderToggle?.checked ?? previous.reminders,
      reducedMotion: reducedMotionToggle?.checked ?? previous.reducedMotion,
      memory: !(privacyToggle?.checked) && Boolean(memoryToggle?.checked)
    };

    localStorage.setItem(settingsKey, JSON.stringify(settings));
    localStorage.setItem(themeKey, settings.theme);
    localStorage.setItem(languageKey, settings.language);
    applySharedPreferences(settings);

    try {
      if (currentUser) await saveCloudSettings(settings);
      setStatus(currentUser
        ? 'Settings saved to your account and this browser.'
        : 'Settings saved in this browser only. Sign in to sync them with your account.');
    } catch (error) {
      console.error('Unable to save cloud settings:', error);
      setStatus('Preferences remain in this browser, but could not be saved to your account. Please try again.', true);
    }
  });
}

const privacyToggle = document.getElementById('settings-privacy');
const memoryToggle = document.getElementById('settings-memory');
if (privacyToggle && memoryToggle) {
  privacyToggle.addEventListener('change', () => {
    memoryToggle.disabled = privacyToggle.checked;
    if (privacyToggle.checked) memoryToggle.checked = false;
  });
}

const resetButton = document.getElementById('reset-settings');
if (resetButton) {
  resetButton.addEventListener('click', async () => {
    localStorage.removeItem(settingsKey);
    localStorage.removeItem(themeKey);
    localStorage.removeItem(languageKey);
    const settings = { ...defaultSettings };
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    applySettingsToUI();
    applySharedPreferences(settings);
    try {
      if (currentUser) await saveCloudSettings(settings);
      setStatus(currentUser
        ? 'Default settings restored in your account and this browser.'
        : 'Default settings restored in this browser.');
    } catch (error) {
      console.error('Unable to reset cloud settings:', error);
      setStatus('Defaults restored in this browser, but cloud settings could not be updated.', true);
    }
  });
}

document.getElementById('clear-local-data')?.addEventListener('click', () => {
  const confirmed = window.confirm('Clear Noracle data saved only in this browser? This will not delete data in your signed-in account.');
  if (!confirmed) return;
  [
    'noracle-profile', 'noracle-settings', 'noracle-language', 'noracle-theme',
    'noracle-journal-entries', 'noracle-journal-draft', 'noracle-mood-entries',
    'noracle-private-journal', 'noracle-mask-session', 'noracle-mask-transfer',
    'noracle-backpack-burdens', 'noracle-vault-items', 'noracle-growth-local',
    'noracle-daily-quote', 'noracle-sidebar-collapsed'
  ].forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(settingsKey, JSON.stringify(defaultSettings));
  applySettingsToUI();
  applySharedPreferences(defaultSettings);
  setStatus('Browser-only data cleared. Data saved to your account was not changed.');
});

document.getElementById('sign-out')?.addEventListener('click', async () => {
  try {
    await signOutUser();
  } catch (error) {
    console.error('Unable to sign out:', error);
    setAccountStatus('Could not sign out. Please try again.', true);
  }
});

document.getElementById('export-data')?.addEventListener('click', async () => {
  if (!currentUser) return;
  const button = document.getElementById('export-data');
  if (button) button.disabled = true;
  setAccountStatus('Preparing your private data export…');
  try {
    const [profile, settings, journals, moods, conversations] = await Promise.all([
      getProfile(), getCloudSettings(), listJournalEntries(100), listMoodEntries(200), listConversations(100)
    ]);
    const conversationData = await Promise.all(conversations.map(async (conversation) => ({
      ...conversation,
      messages: await listConversationMessages(conversation.id, 100)
    })));
    const blob = new Blob([JSON.stringify({
      exportedAt: new Date().toISOString(),
      account: currentUser.email || null,
      profile,
      settings,
      journals,
      moods,
      conversations: conversationData
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'noracle-data-export.json';
    link.click();
    URL.revokeObjectURL(url);
    setAccountStatus('Your account data export was downloaded.');
  } catch (error) {
    console.error('Unable to export account data:', error);
    setAccountStatus('Your data export failed. Please try again.', true);
  } finally {
    if (button) button.disabled = !cloudReady;
  }
});

document.getElementById('delete-account')?.addEventListener('click', async () => {
  if (!currentUser) return;
  const confirmed = window.confirm('Delete your account and all saved profile, journal, mood, and conversation data? This cannot be undone.');
  if (!confirmed) return;
  const password = window.prompt('For security, enter your account password to confirm deletion.');
  if (!password) return;
  const button = document.getElementById('delete-account');
  if (button) button.disabled = true;

  try {
    await deleteFirebaseAccount(password);
    [
      'noracle-profile', 'noracle-settings', 'noracle-language', 'noracle-theme',
      'noracle-journal-entries', 'noracle-journal-draft', 'noracle-moods', 'noracle-chat'
    ].forEach((key) => localStorage.removeItem(key));
    currentUser = null;
    cloudReady = false;
    setAccountStatus('Your account and saved cloud data were deleted.');
    setAccountControlsEnabled(false);
  } catch (error) {
    console.error('Unable to delete account:', error);
    setAccountStatus(
      error.firestoreDataDeleted
        ? 'Saved cloud data was deleted, but Firebase could not delete the account. Contact support before trying again.'
        : error.code === 'auth/requires-recent-login'
          ? 'Please sign in again, then retry account deletion.'
          : error.message || 'Account deletion failed. Your account was not deleted.',
      true
    );
    setAccountControlsEnabled(true);
  }
});

applySettingsToUI();
applySharedPreferences(readSettings());
