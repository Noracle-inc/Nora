import { observeAuth } from './auth.js';
import { getProfile, saveProfile as saveCloudProfile } from './firestore-data.js';

const profileKey = 'noracle-profile';
const defaultProfile = {
  name: 'You',
  greeting: 'Hello, you.',
  pronouns: 'they/them',
  bio: 'I am learning gently and listening to my own rhythm.',
  focus: 'Calm, clarity, and rest.'
};

const readLocalProfile = () => {
  try {
    return { ...defaultProfile, ...JSON.parse(localStorage.getItem(profileKey) || '{}') };
  } catch (error) {
    console.error('Unable to read the local profile:', error);
    return { ...defaultProfile };
  }
};

let currentUser = null;
const form = document.getElementById('profile-form');
const status = document.getElementById('profile-status');
const accountStatus = document.getElementById('profile-account-status');
const fields = {
  name: document.getElementById('profile-name'),
  greeting: document.getElementById('profile-greeting'),
  pronouns: document.getElementById('profile-pronouns'),
  bio: document.getElementById('profile-bio'),
  focus: document.getElementById('profile-focus')
};

const renderProfile = (profile) => {
  Object.entries(fields).forEach(([key, field]) => {
    if (field) field.value = profile[key] || defaultProfile[key];
  });
  const greeting = document.getElementById('dashboard-greeting');
  if (greeting) greeting.textContent = profile.greeting || defaultProfile.greeting;
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    avatar.textContent = (profile.name || 'Y').trim().charAt(0).toUpperCase();
    avatar.setAttribute('aria-label', `${profile.name || 'Your'} profile`);
  }
};

const setStatus = (message, isError = false) => {
  if (!status) return;
  status.textContent = message;
  status.setAttribute('aria-invalid', String(isError));
};

const showSignInLink = (message) => {
  if (!accountStatus) return;
  accountStatus.textContent = `${message} `;
  const signInLink = document.createElement('a');
  signInLink.href = 'onboarding.html?mode=login';
  signInLink.textContent = 'Sign in';
  accountStatus.appendChild(signInLink);
};

renderProfile(readLocalProfile());
showSignInLink('Sign in to link this profile to your private account.');

try {
  observeAuth(async (user) => {
    currentUser = user;
    if (!accountStatus) return;
    if (!user) {
      showSignInLink('Signed out. This profile is saved only in this browser.');
      return;
    }

    accountStatus.textContent = `Signed in as ${user.email || 'your account'}.`;
    renderProfile(defaultProfile);
    try {
      const savedProfile = await getProfile();
      renderProfile(savedProfile ? { ...defaultProfile, ...savedProfile } : defaultProfile);
    } catch (error) {
      console.error('Unable to load your cloud profile:', error);
      accountStatus.textContent = 'Signed in, but your cloud profile could not be loaded. Please try again.';
    }
  });
} catch (error) {
  if (accountStatus) {
    accountStatus.textContent = 'Cloud profile is unavailable until Firebase is configured. This profile remains in this browser.';
  }
  console.info('Firebase profile sync is unavailable:', error.message);
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const profile = Object.fromEntries(
      Object.entries(fields).map(([key, field]) => [key, field?.value.trim() || defaultProfile[key]])
    );

    try {
      if (currentUser) {
        await saveCloudProfile(profile);
      }
      localStorage.setItem(profileKey, JSON.stringify(profile));
      renderProfile(profile);
      setStatus(currentUser
        ? 'Profile saved to your account and this browser.'
        : 'Profile saved in this browser only. Sign in to sync it with your account.');
    } catch (error) {
      console.error('Unable to save profile:', error);
      setStatus('Profile could not be saved to your account. Please try again.', true);
    }
  });
}
