import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class BackendContractTests(unittest.TestCase):
    def test_shared_json_personal_data_store_is_removed(self):
        self.assertFalse((ROOT / "backend" / "data" / "store.json").exists())
        self.assertFalse((ROOT / "backend" / "routes" / "api.js").exists())
        server = (ROOT / "backend" / "server.js").read_text(encoding="utf-8")
        self.assertNotIn("readStore", server)
        self.assertIn("authenticateRequest(req)", server)
        self.assertIn("'/api/assistant'", server)

    def test_firebase_web_config_is_blank_and_rules_are_owner_scoped(self):
        config = (ROOT / "js" / "firebase-config.js").read_text(encoding="utf-8")
        for field in ("apiKey", "authDomain", "projectId", "messagingSenderId", "appId"):
            self.assertRegex(config, rf"{field}: ''")
        rules = (ROOT / "firestore.rules").read_text(encoding="utf-8")
        self.assertIn("request.auth.uid == uid", rules)
        for collection in ("profile", "preferences", "journals", "moods", "conversations"):
            self.assertIn(f"/{collection}/", rules)

    def test_environment_template_has_no_populated_provider_secrets(self):
        template = (ROOT / ".env.example").read_text(encoding="utf-8")
        self.assertRegex(template, r"(?m)^ANTHROPIC_API_KEY=$")
        self.assertRegex(template, r"(?m)^FIREBASE_PROJECT_ID=$")
        self.assertNotIn("-----BEGIN", template)

    def test_client_modules_cover_auth_cloud_data_and_backend_contract(self):
        auth = (ROOT / "js" / "auth.js").read_text(encoding="utf-8")
        data = (ROOT / "js" / "firestore-data.js").read_text(encoding="utf-8")
        self.assertIn("export async function deleteAccount(password)", auth)
        self.assertIn("reauthenticateWithCredential", auth)
        self.assertIn("createUserWithEmailAndPassword", auth)
        self.assertIn("signInWithEmailAndPassword", auth)
        self.assertIn("Authorization:", auth)
        self.assertIn("Bearer", auth)
        for method in (
            "getProfile", "saveProfile", "getPreferences", "savePreferences", "getSettings", "saveSettings",
            "createJournalEntry", "listJournalEntries", "deleteJournalEntry", "createMoodEntry",
            "listMoodEntries", "deleteMoodEntry", "createConversation", "listConversations",
            "appendConversationMessage", "listConversationMessages", "deleteConversation", "deleteAllUserData"
        ):
            self.assertIn(method, data)
        chat = (ROOT / "js" / "chat.js").read_text(encoding="utf-8")
        self.assertIn("requestAssistant(value, history)", chat)

    def test_profile_settings_journal_mood_and_chat_are_wired_to_account_data(self):
        profile = (ROOT / "js" / "profile.js").read_text(encoding="utf-8")
        settings = (ROOT / "js" / "settings.js").read_text(encoding="utf-8")
        journal = (ROOT / "js" / "journal.js").read_text(encoding="utf-8")
        mood = (ROOT / "js" / "mood.js").read_text(encoding="utf-8")
        chat = (ROOT / "js" / "chat.js").read_text(encoding="utf-8")
        rules = (ROOT / "firestore.rules").read_text(encoding="utf-8")

        self.assertIn("saveCloudProfile(profile)", profile)
        self.assertIn("saveCloudSettings(settings)", settings)
        self.assertIn("createJournalEntry(entry)", journal)
        self.assertIn("createMoodEntry(entry)", mood)
        self.assertIn("settings.memory === true", chat)
        self.assertIn("settings.privacyMode !== 'private'", chat)
        self.assertIn("'memory'", rules)

    def test_signed_out_entries_are_not_silently_migrated(self):
        for filename, key in (
            ("js/journal.js", "noracle-journal-entries"),
            ("js/mood.js", "noracle-mood-entries")
        ):
            content = (ROOT / filename).read_text(encoding="utf-8")
            self.assertIn(key, content)
            self.assertIn("if (currentUser)", content)
            self.assertIn("only in this browser", content)


if __name__ == "__main__":
    unittest.main()
