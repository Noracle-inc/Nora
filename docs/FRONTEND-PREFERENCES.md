# Front-end theme and language preferences

The theme and language choices are stored in this browser under `noracle-theme`, `noracle-language`, and the corresponding `theme` and `language` fields in the `noracle-settings` JSON object. The supported theme values are `light-starry`, `dusk`, and `gold`; locale codes are `en`, `pcm`, `yo`, `ig`, and `ha`.

The shared `js/app.js` layer initializes controls on pages without existing selectors, and binds existing `#language-select`, `#settings-language`, and `#settings-theme` controls without requiring changes to their markup. The theme button cycles through the three themes; preference changes are synchronized between open tabs.

The shared layer also reads `reducedMotion` from `noracle-settings` and toggles `html.user-reduced-motion` on every page. `css/main.css` disables animations, transitions, and smooth scrolling under that class; the operating system's `prefers-reduced-motion` setting is honored too. Updates to the shared settings key are applied in other open tabs.

`js/app.js` makes no API requests. Growth tracker values use the new `noracle-growth-local` browser key and the daily quote is browser-local only; the tracker says directly that progress is not synced. The previous `noracle-growth` key (which could contain a response from the former shared store) is not read. Growth begins at zero when there is no local record. Do not reconnect shared, unauthenticated growth/quote endpoints; replace browser-local persistence only after per-user Firebase persistence is available and verified.

Integration contract for dashboard/profile/settings owners:

- Keep language option values exactly `en`, `pcm`, `yo`, `ig`, `ha` (English, Nigerian Pidgin, Yorùbá, Igbo, Hausa). Do not use language names or alternate locale codes as stored values.
- Keep preference storage keys `noracle-theme`, `noracle-language`, and `noracle-settings`; the JSON object stores `theme` and `language` alongside other settings.
- `window.NoraclePreferences.setLanguage(code)` validates the locale, updates the document language and translated `[data-i18n]` / `[data-i18n-placeholder]` nodes, and persists both language keys. `window.NoraclePreferences.setTheme(theme)` applies and persists an allowed theme. Call these methods from custom controls rather than duplicating storage logic.
- Persist the reduced-motion preference as the boolean `reducedMotion` field in `noracle-settings`; shared app behavior applies it on page load and when the settings key changes in another tab.
- Existing selectors should have IDs `language-select` or `settings-language`, and `settings-theme`; app.js binds those IDs automatically.

Localization uses the locale codes `en`, `pcm`, `yo`, `ig`, and `ha`. The translated interface includes dashboard navigation and feature cards, account/profile/settings controls, dashboard progress labels, and selected homepage content. Other tool-page copy and dynamic server responses may remain in English; this is not complete app localization. Have fluent speakers review the translations before production.

TODO(verify): Native speakers must review the existing Pidgin, Yorùbá, Igbo, and Hausa strings before they are presented as approved translations or expanded to additional product copy.
