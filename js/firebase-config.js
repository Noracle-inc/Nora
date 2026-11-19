// Firebase web configuration is public, but must be supplied for each deployment.
// Keep these values blank in source control; Firebase API keys are not server secrets.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

export const firebaseConfig = Object.freeze({
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
});

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
  && firebaseConfig.messagingSenderId && firebaseConfig.appId
);

let app;
let auth;
let db;
if (firebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };

export function requireFirebase() {
  if (!firebaseConfigured) {
    throw new Error('Firebase is not configured. Set the public web config for this deployment before enabling sign-in or cloud data.');
  }
  return { auth, db };
}
