import { firebaseConfigured } from './firebase-config.js';
import { createAccount, observeAuth, signIn, signOutUser } from './auth.js';

const form = document.getElementById('auth-form');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const submitButton = document.getElementById('auth-submit');
const modeToggle = document.getElementById('auth-mode-toggle');
const status = document.getElementById('auth-status');
const signOutButton = document.getElementById('auth-sign-out');
let mode = new URLSearchParams(window.location.search).get('mode') === 'login' ? 'login' : 'signup';
let currentUser = null;

const renderMode = () => {
  if (submitButton) submitButton.textContent = mode === 'signup' ? 'Create account' : 'Sign in';
  if (modeToggle) modeToggle.textContent = mode === 'signup' ? 'I already have an account' : 'Create a new account';
  if (passwordInput) passwordInput.autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
};

const setStatus = (message, isError = false) => {
  if (!status) return;
  status.textContent = message;
  status.setAttribute('aria-invalid', String(isError));
};

if (modeToggle) {
  modeToggle.addEventListener('click', () => {
    mode = mode === 'signup' ? 'login' : 'signup';
    renderMode();
    setStatus(mode === 'signup' ? 'Create an account to save data privately.' : 'Sign in to your account.');
  });
}

if (!firebaseConfigured) {
  setStatus('Account access is unavailable until Firebase is configured for this deployment.', true);
} else {
  if (submitButton) submitButton.disabled = false;
  if (modeToggle) modeToggle.disabled = false;
  try {
    observeAuth((user) => {
      currentUser = user;
      if (signOutButton) signOutButton.hidden = !user;
      if (user) setStatus(`Signed in as ${user.email || 'your account'}.`);
    });
  } catch (error) {
    setStatus(error.message, true);
  }
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!firebaseConfigured) return;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (password.length < 8) {
      setStatus('Use a password with at least 8 characters.', true);
      return;
    }

    submitButton.disabled = true;
    modeToggle.disabled = true;
    setStatus(mode === 'signup' ? 'Creating your account…' : 'Signing in…');
    try {
      if (mode === 'signup') await createAccount(email, password);
      else await signIn(email, password);
      window.location.assign('onboarding.html?step=preferences');
    } catch (error) {
      console.error('Authentication failed:', error);
      setStatus(error.message || 'We could not complete sign-in. Please check your details and try again.', true);
    } finally {
      submitButton.disabled = false;
      modeToggle.disabled = false;
    }
  });
}

document.getElementById('auth-sign-out')?.addEventListener('click', async () => {
  if (!currentUser) return;
  try {
    await signOutUser();
    setStatus('You have signed out.');
  } catch (error) {
    console.error('Sign-out failed:', error);
    setStatus('Could not sign out. Please try again.', true);
  }
});

renderMode();
