# Firebase and backend integration

## Status and boundaries

- The old shared `backend/data/store.json` and its personal-data API routes are removed. There is no server-side JSON fallback.
- Authentication and personal records use Firebase Auth and Firestore directly from the browser, scoped to `users/{Firebase UID}/...` and enforced by `firestore.rules`.
- Only `POST /api/assistant` accepts an AI request. It verifies a Firebase ID token with Firebase Admin before parsing or forwarding user content.
- Claude credentials remain server-only. Browser Firebase web configuration is public and deliberately blank in `js/firebase-config.js`.
- Email/password sign-up and sign-in are wired on `onboarding.html`. Profile and Settings load/save account-scoped Firestore data when signed in; signed-out profile/settings remain browser-local and are clearly labeled.
- Journal and mood entries are written to the signed-in user's Firestore account. Signed-out entries remain local to the browser. Account settings provide an export, sign-out, and reauthenticated account/data deletion flow.
- `js/chat.js` calls the protected assistant API. Conversation history remains off by default and is saved only when a signed-in user turns off private mode and explicitly enables optional history.
- Health checks and missing/unconfigured provider responses do not imply that sign-in or AI service is operational.

## Browser modules and Firestore layout

Use the ES modules from pages or other modules:

- `js/auth.js` exports `createAccount(email, password)`, `signIn(email, password)`, `signOutUser()`, `observeAuth(callback)`, `getIdToken()`, `requestAssistant(message, history, options)`, and `deleteAccount(password)`.
- `js/firestore-data.js` exports `getProfile`/`saveProfile`, `getPreferences`/`savePreferences` (also named `getSettings`/`saveSettings`), journal methods `createJournalEntry`/`listJournalEntries`/`updateJournalEntry`/`deleteJournalEntry`, mood methods `createMoodEntry`/`listMoodEntries`/`deleteMoodEntry`, conversation methods `createConversation`/`listConversations`/`appendConversationMessage`/`listConversationMessages`/`deleteConversation`, and `deleteAllUserData`.
- Profile/settings pages use `import { getProfile, saveProfile, getSettings, saveSettings } from './firestore-data.js'` from modules under `js/`. The `get*` methods return the saved object or `null`; save methods return Firestore write promises.
- Journal signatures are `createJournalEntry({ title, text })`, `listJournalEntries(maxItems = 50)`, `updateJournalEntry(id, fields)`, and `deleteJournalEntry(id)`. Mood signatures are `createMoodEntry({ mood, note = '' })`, `listMoodEntries(maxItems = 100)`, and `deleteMoodEntry(id)`. Conversation signatures are `createConversation(title = '')`, `listConversations(maxItems = 50)`, `appendConversationMessage(conversationId, { role, content })`, `listConversationMessages(conversationId, maxItems = 100)`, and `deleteConversation(conversationId)`. List methods return arrays of records containing document IDs.
- Documents are stored at `users/{uid}/profile/current` and `users/{uid}/preferences/current`; journal and mood records under `journals/{id}` and `moods/{id}`; conversations under `conversations/{id}` with messages under `conversations/{id}/messages/{messageId}`.
- Data methods derive the UID from the current Firebase Auth session. Do not accept a UID from page input or put private records in a top-level shared collection.
- `deleteAccount(password)` reauthenticates the currently signed-in email/password user, deletes that user's Firestore records, then deletes the Firebase Auth account. Firebase requires recent login for account deletion; if reauthentication fails, no Firestore deletion begins. The method is for email/password accounts and the caller should surface Firebase errors and require explicit user confirmation before calling it. If Auth deletion fails after the Firestore purge, the thrown error has `firestoreDataDeleted: true`; the account can remain active with its records already removed.
- Rules permit only owner reads/writes and enforce field allowlists and record size/enum limits. Journal entries permit title 120 chars/text 10,000 chars; mood values are `very-low`, `low`, `okay`, `good`, `very-good`; conversation message text is limited to 8,000 chars and each conversation to 100 messages by the transaction-backed client helper.
- Firestore Auth/rules remain the security boundary. Do not replace them with client-side checks.

## Assistant HTTP contract

Request: `POST /api/assistant`, `Content-Type: application/json`, `Authorization: Bearer <Firebase ID token>`.

```json
{
  "message": "A bounded non-empty string (maximum 8,000 characters)",
  "history": [
    { "role": "user", "content": "Prior user turn" },
    { "role": "assistant", "content": "Prior assistant turn" }
  ]
}
```

`history` is optional, at most 10 messages, each at most 4,000 characters; it must begin with `user`, alternate roles, and end with `assistant`. The current `message` is appended by the backend. Responses are `{ "reply": "...", "safety": { "level": "standard|urgent", "handoffRequired": false|true } }`. Urgent detected language gets a brief local emergency/trusted-person handoff without a Claude call. It does not provide a hotline number or claim that a real human handoff has occurred.

Errors use `{ "error": { "code": "...", "message": "..." } }`: missing/invalid identity is 401; missing server setup is 503; malformed/oversize input is 400/413; provider errors are reported as a generic 502. User content and tokens are not logged. The assistant is an AI wellbeing companion, not therapy, clinical care, or emergency response.

## Local setup

1. Install Node.js 18+ and run `npm install`.
2. Create a Firebase project. Enable Email/Password in Authentication and create a Firestore database.
3. Configure the public Firebase web app values in `js/firebase-config.js` (the web config/API key is public; do not put a service-account credential or Claude key here). Keep production values in deployment configuration rather than committing deployment secrets.
4. Deploy rules from the repository root with Firebase CLI: `firebase deploy --only firestore:rules --project YOUR_FIREBASE_PROJECT_ID`. `firebase.json` points to the supplied rules.
5. Copy `.env.example` to ignored `.env`; set `FIREBASE_PROJECT_ID`, `CLAUDE_MODEL`, `ANTHROPIC_API_KEY`, and exact `ALLOWED_ORIGINS`. Supply Firebase Admin credentials through Application Default Credentials or `GOOGLE_APPLICATION_CREDENTIALS` pointing to a credential file outside this repository. Do not commit credentials.
6. Run `npm start`; the Node server serves the static app and API on port 3000. Open the server URL over HTTP (not `file://`). Before production, use HTTPS and a platform-managed identity/secret store.
7. Verify `/api/health`, email/password signup, profile/settings save, journal and mood records, opt-in conversation history, export/deletion, cross-user Firestore denial using the Firebase Rules Emulator or two test accounts, and an authenticated assistant call. The API must return 503 when provider/auth configuration is missing; that is an unconfigured state, not a production-ready mode.

For a separately hosted browser app, set `ALLOWED_ORIGINS` to exact HTTPS origins and pass the backend URL via `requestAssistant(..., { endpoint })`. Never use `*` for credentialed deployment. The in-memory Node server does not implement durable rate limiting; deploy behind a gateway with per-user/IP abuse limits and provider budget alerts.

## Before production

- Configure Auth authorized domains and secure deployment origins.
- Confirm Firebase rules with emulator tests and review Firestore retention, export, and deletion flows.
- Configure platform-managed secrets, HTTPS, abuse/rate controls, monitoring, and spend limits.
- Review Anthropic data retention/processing terms and applicable privacy law.
- The crisis classifier is a small keyword signal, not clinical triage; validate it with qualified safety reviewers. Crisis contacts remain unconfigured until locally verified. Do not treat this feature as emergency support.
