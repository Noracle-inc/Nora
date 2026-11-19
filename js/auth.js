import {
  createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, onAuthStateChanged,
  reauthenticateWithCredential, signInWithEmailAndPassword, signOut
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { requireFirebase } from './firebase-config.js';
import { deleteAllUserData } from './firestore-data.js';

export function createAccount(email, password) {
  const { auth } = requireFirebase();
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signIn(email, password) {
  const { auth } = requireFirebase();
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOutUser() {
  const { auth } = requireFirebase();
  return signOut(auth);
}

export async function deleteAccount(password) {
  const { auth } = requireFirebase();
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in is required to delete this account.');
  if (!user.email || typeof password !== 'string' || !password) {
    throw new Error('Account deletion requires the signed-in email and password.');
  }

  // Firebase requires recent authentication for deleting an account.
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
  await deleteAllUserData();
  try {
    await deleteUser(user);
  } catch (error) {
    error.firestoreDataDeleted = true;
    throw error;
  }
}

export function observeAuth(callback) {
  const { auth } = requireFirebase();
  return onAuthStateChanged(auth, callback);
}

export async function getIdToken() {
  const { auth } = requireFirebase();
  if (!auth.currentUser) throw new Error('Sign in is required for this request.');
  return auth.currentUser.getIdToken();
}

export async function requestAssistant(message, history = [], options = {}) {
  const token = await getIdToken();
  const response = await fetch(options.endpoint || '/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message, history })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.message || 'Assistant request failed.');
    error.code = payload.error?.code || 'request_failed';
    error.status = response.status;
    throw error;
  }
  return payload;
}
