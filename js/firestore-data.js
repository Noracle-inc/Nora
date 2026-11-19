import {
  addDoc, collection, deleteDoc, doc, documentId, getDoc, getDocs, limit, orderBy,
  query, runTransaction, serverTimestamp, setDoc, startAfter, updateDoc, writeBatch
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { requireFirebase } from './firebase-config.js';

function userRoot() {
  const { auth, db } = requireFirebase();
  if (!auth.currentUser) throw new Error('Sign in is required to access personal data.');
  return { db, root: ['users', auth.currentUser.uid] };
}

function userDoc(collectionName, documentId) {
  const { db, root } = userRoot();
  return doc(db, ...root, collectionName, documentId);
}

function userCollection(collectionName, documentId) {
  const { db, root } = userRoot();
  return collection(db, ...root, collectionName, ...(documentId ? [documentId] : []));
}

export async function getProfile() {
  const snapshot = await getDoc(userDoc('profile', 'current'));
  return snapshot.exists() ? snapshot.data() : null;
}

export function saveProfile(fields) {
  return setDoc(userDoc('profile', 'current'), { ...fields, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getPreferences() {
  const snapshot = await getDoc(userDoc('preferences', 'current'));
  return snapshot.exists() ? snapshot.data() : null;
}

export function savePreferences(fields) {
  return setDoc(userDoc('preferences', 'current'), { ...fields, updatedAt: serverTimestamp() }, { merge: true });
}

export const getSettings = getPreferences;
export const saveSettings = savePreferences;

export function createJournalEntry({ title, text }) {
  return addDoc(userCollection('journals'), { title, text, createdAt: serverTimestamp() });
}

export async function listJournalEntries(maxItems = 50) {
  const safeLimit = Math.min(100, Math.max(1, Number(maxItems) || 50));
  const snapshots = await getDocs(query(userCollection('journals'), orderBy('createdAt', 'desc'), limit(safeLimit)));
  return snapshots.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function updateJournalEntry(id, fields) {
  return updateDoc(userDoc('journals', id), fields);
}

export function deleteJournalEntry(id) {
  return deleteDoc(userDoc('journals', id));
}

export function createMoodEntry({ mood, note = '' }) {
  return addDoc(userCollection('moods'), { mood, note, createdAt: serverTimestamp() });
}

export async function listMoodEntries(maxItems = 100) {
  const safeLimit = Math.min(200, Math.max(1, Number(maxItems) || 100));
  const snapshots = await getDocs(query(userCollection('moods'), orderBy('createdAt', 'desc'), limit(safeLimit)));
  return snapshots.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function deleteMoodEntry(id) {
  return deleteDoc(userDoc('moods', id));
}

export async function createConversation(title = '') {
  return addDoc(userCollection('conversations'), {
    title, messageCount: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
}

export async function listConversations(maxItems = 50) {
  const safeLimit = Math.min(100, Math.max(1, Number(maxItems) || 50));
  const snapshots = await getDocs(query(
    userCollection('conversations'), orderBy('updatedAt', 'desc'), limit(safeLimit)
  ));
  return snapshots.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function appendConversationMessage(conversationId, { role, content }) {
  if (!['user', 'assistant'].includes(role) || typeof content !== 'string'
    || !content.trim() || content.length > 8000) {
    throw new Error('Conversation messages require a user/assistant role and 1–8,000 characters.');
  }
  const conversationRef = userDoc('conversations', conversationId);
  const { db, root } = userRoot();
  const messageRef = doc(collection(db, ...root, 'conversations', conversationId, 'messages'));
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(conversationRef);
    if (!snapshot.exists()) throw new Error('Conversation not found.');
    const count = Number(snapshot.data().messageCount) || 0;
    if (count >= 100) throw new Error('Conversation has reached its 100-message limit.');
    transaction.set(messageRef, { role, content, sequence: count + 1, createdAt: serverTimestamp() });
    transaction.update(conversationRef, { messageCount: count + 1, updatedAt: serverTimestamp() });
  });
}

export async function listConversationMessages(conversationId, maxItems = 100) {
  const safeLimit = Math.min(100, Math.max(1, Number(maxItems) || 100));
  const snapshots = await getDocs(query(
    collection(requireFirebase().db, ...userRoot().root, 'conversations', conversationId, 'messages'),
    orderBy('sequence', 'asc'),
    limit(safeLimit)
  ));
  return snapshots.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function deleteConversation(conversationId) {
  const { db, root } = userRoot();
  const messages = collection(db, ...root, 'conversations', conversationId, 'messages');
  await deleteCollectionContents(messages);
  return deleteDoc(userDoc('conversations', conversationId));
}

async function deleteCollectionContents(collectionRef) {
  const { db } = userRoot();
  let cursor;
  while (true) {
    const constraints = [orderBy(documentId()), limit(250)];
    if (cursor) constraints.push(startAfter(cursor));
    const page = await getDocs(query(collectionRef, ...constraints));
    if (page.empty) return;
    const batch = writeBatch(db);
    page.docs.forEach((snapshot) => batch.delete(snapshot.ref));
    await batch.commit();
    cursor = page.docs[page.docs.length - 1];
  }
}

export async function deleteAllUserData() {
  const { db, root } = userRoot();
  const rootCollectionNames = ['profile', 'preferences', 'journals', 'moods'];
  for (const name of rootCollectionNames) {
    await deleteCollectionContents(collection(db, ...root, name));
  }

  const conversations = collection(db, ...root, 'conversations');
  let cursor;
  while (true) {
    const constraints = [orderBy(documentId()), limit(100)];
    if (cursor) constraints.push(startAfter(cursor));
    const page = await getDocs(query(conversations, ...constraints));
    if (page.empty) break;
    for (const conversation of page.docs) {
      await deleteCollectionContents(collection(
        db, ...root, 'conversations', conversation.id, 'messages'
      ));
      await deleteDoc(conversation.ref);
    }
    cursor = page.docs[page.docs.length - 1];
  }
}
