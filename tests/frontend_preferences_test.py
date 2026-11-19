import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


class FrontendPreferencesTests(unittest.TestCase):
    def test_existing_locale_files_keep_their_correct_codes(self):
        expected = {"en", "pcm", "yo", "ig", "ha"}
        self.assertEqual({path.stem for path in (ROOT / "locales").glob("*.json")}, expected)
        for code in expected:
            with self.subTest(locale=code):
                payload = json.loads((ROOT / "locales" / f"{code}.json").read_text(encoding="utf-8"))
                self.assertTrue({"brand", "greeting", "ctaPrimary", "ctaSecondary"} <= payload.keys())

    def test_shared_preference_controls_and_theme_cycle_are_wired(self):
        app = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        for theme in ("light-starry", "dusk", "gold"):
            self.assertIn(f"theme-{theme}", app)
        self.assertIn("noracle-theme", app)
        self.assertIn("noracle-settings", app)
        self.assertIn("window.addEventListener('storage'", app)
        self.assertIn("setAttribute('aria-label'", app)
        self.assertIn("window.NoraclePreferences", app)
        self.assertIn("setLanguage,", app)
        self.assertIn("setTheme: applyTheme", app)
        self.assertIn("initSettingsThemeSelector();", app)
        self.assertIn("preferences.append(label, select)", app)

    def test_saved_reduced_motion_applies_globally_and_tracks_settings_changes(self):
        app = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        css = (ROOT / "css" / "main.css").read_text(encoding="utf-8")
        self.assertIn("const applyReducedMotion", app)
        self.assertIn("settings.reducedMotion === true", app)
        self.assertIn("applyReducedMotion();", app)
        self.assertIn("if (event.key === settingsKey)", app)
        self.assertIn("html.user-reduced-motion", css)
        self.assertIn("animation: none !important", css)
        self.assertIn("transition: none !important", css)

    def test_all_five_locale_codes_are_used_by_shared_selector(self):
        app = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        for code in ("en", "pcm", "yo", "ig", "ha"):
            self.assertRegex(app, rf"\['{code}',\s*'")
        self.assertIsNone(re.search(r"^\s+(?:hausa|igbo|yoruba|pidgin):\s*\{", app, re.MULTILINE))

    def test_homepage_has_safe_by_design_content_and_existing_art(self):
        homepage = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn("Safe by design", homepage)
        self.assertIn('src="./assets/safe-by-design.png"', homepage)
        self.assertIn("Noracle is AI, not a therapist.", homepage)

    def test_homepage_has_accessible_theme_toggle_wired_to_shared_handler(self):
        homepage = (ROOT / "index.html").read_text(encoding="utf-8")
        app = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        self.assertRegex(
            homepage,
            r'<button id="theme-toggle"[^>]*aria-label="Change color theme"',
        )
        self.assertIn("document.querySelector('#theme-toggle')", app)
        self.assertIn("toggle.addEventListener('click'", app)

    def test_homepage_auth_buttons_select_requested_onboarding_mode(self):
        homepage = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertRegex(homepage, r'data-route="onboarding\.html\?mode=login"[^>]*>Log in</button>')
        self.assertRegex(homepage, r'data-route="onboarding\.html\?mode=signup"[^>]*>Sign up</button>')

    def test_app_local_growth_and_quote_state_never_calls_shared_api(self):
        app = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        self.assertNotIn("fetch(", app)
        self.assertNotIn("/api/growth", app)
        self.assertNotIn("/api/quote", app)
        self.assertIn("growth-local-only-note", app)
        self.assertIn("not synced to an account", app)
        self.assertIn("const getGrowthState = () =>", app)
        self.assertIn("const growthKey = 'noracle-growth-local'", app)
        self.assertNotIn("const growthKey = 'noracle-growth';", app)


if __name__ == "__main__":
    unittest.main()
