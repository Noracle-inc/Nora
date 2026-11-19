const storageKey = 'noracle-theme';
const languageKey = 'noracle-language';
const settingsKey = 'noracle-settings';
const growthKey = 'noracle-growth-local';
const quoteKey = 'noracle-daily-quote';
const sidebarKey = 'noracle-sidebar-collapsed';

const dailyQuotes = [
  'You are allowed to be human here.',
  'Small consistency is still growth.',
  'Rest is not laziness. It is part of healing.',
  'Your feelings are data, not a failure.',
  'You do not have to carry every heavy thing alone.',
  'Progress is often quiet before it is visible.'
];

const translations = {
  en: {
    'landing.ctaPrimary': 'Start your journey',
    'landing.ctaSecondary': 'Explore Noracle',
    'time.goodEvening': 'Good evening',
    'page.hello': 'Hello, you.',
    'nav.language': 'Language',
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.nora': 'Nora AI',
    'nav.therapist': 'Real therapist',
    'nav.community': 'Communities',
    'nav.scream': 'Scream room',
    'nav.meditate': 'Meditate',
    'nav.breathing': 'Breathing',
    'nav.journal': 'Journal',
    'nav.mood': 'Mood',
    'nav.backpack': 'Emotional Backpack',
    'nav.maskOff': 'Mask Off',
    'nav.vault': 'Vault',
    'nav.budget': 'Budget Whisperer',
    'card.nora': 'Nora',
    'card.noraText': 'Check in with your thoughts and notice what feels heavy right now.',
    'card.openNora': 'Open Nora',
    'card.mood': 'Mood',
    'card.moodText': 'How do you feel today?',
    'card.trackMood': 'Track mood',
    'card.journal': 'Journal',
    'card.journalText': 'Write what needs to be said.',
    'card.openJournal': 'Open journal',
    'card.maskOff': 'Mask Off',
    'card.maskOffText': 'Say the part you have been carrying alone.',
    'card.maskOffButton': 'Open Mask Off',
    'card.backpack': 'Emotional Backpack',
    'card.backpackText': 'Notice what you carry and let some weight loosen.',
    'card.backpackButton': 'Open backpack',
    'card.breathing': 'Breathing',
    'card.breathingText': 'Reset with a small pause.',
    'card.breathe': 'Breathe',
    'card.meditation': 'Meditation',
    'card.meditationText': 'Let the mind settle and come back to breath.',
    'card.meditationButton': 'Meditate',
    'dashboard.growth': 'Growth tracker',
    'dashboard.logWin': 'Log a win',
    'dashboard.weekly': 'Weekly progress',
    'dashboard.monthly': 'Monthly progress',
    'dashboard.streak': 'day streak',
    'dashboard.notifications': 'Notification centre',
    'dashboard.todayQuote': 'Today’s quote',
    'profile.title': 'Profile',
    'profile.name': 'Display name',
    'profile.pronouns': 'Pronouns',
    'profile.greeting': 'Greeting',
    'profile.bio': 'Short bio',
    'profile.focus': 'Current focus',
    'profile.save': 'Save profile',
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.daily': 'Daily notifications',
    'settings.private': 'Private mode (do not save new conversations)',
    'settings.reminders': 'Gentle reminders',
    'settings.motion': 'Reduce motion',
    'settings.memory': 'Save conversations to my account history (optional)',
    'settings.save': 'Save settings',
    'settings.reset': 'Reset to defaults',
    'settings.data': 'Your data and account',
    'settings.export': 'Export my data',
    'settings.signOut': 'Sign out',
    'settings.delete': 'Delete account and data',
    'safe.title': 'Safe by design',
    'safe.peopleFirst': 'People first'
  },
  ha: {
    'landing.ctaPrimary': 'Fara tafiyarka',
    'landing.ctaSecondary': 'Bincika Noracle',
    'time.goodEvening': 'Yau lafiya',
    'page.hello': 'Sannu, kai.',
    'nav.language': 'Harshe',
    'nav.home': 'Gida',
    'nav.profile': 'Bayanan martaba',
    'nav.settings': 'Saituna',
    'nav.nora': 'Nora AI',
    'nav.therapist': 'Likitan gaske',
    'nav.community': 'Al’ummomi',
    'nav.scream': 'Dakin daaki',
    'nav.meditate': 'Tunani',
    'nav.breathing': 'Numfashi',
    'nav.journal': 'Jarida',
    'nav.mood': 'Halin zuciya',
    'nav.backpack': 'Jakar Hankali',
    'nav.maskOff': 'Mask Off',
    'nav.vault': 'Kwatso',
    'nav.budget': 'Muryar Kasafin Kudi',
    'card.nora': 'Nora',
    'card.noraText': 'Yi tambaya game da tunaninka kuma ka gane abin da ke dama a cikin ka.',
    'card.openNora': 'Buɗe Nora',
    'card.mood': 'Hali',
    'card.moodText': 'Yaya halin ka yau?',
    'card.trackMood': 'Bi hali',
    'card.journal': 'Jarida',
    'card.journalText': 'Rubuta abin da ke cikin zuciya.',
    'card.openJournal': 'Buɗe jarida',
    'card.maskOff': 'Mask Off',
    'card.maskOffText': 'Faɗa ɓangaren da kuka riƙe kaɗai.',
    'card.maskOffButton': 'Buɗe Mask Off',
    'card.backpack': 'Jakar Hankali',
    'card.backpackText': 'Ka gane abin da ke cikin jakarka ka sauƙaƙe ɗanɗano.',
    'card.backpackButton': 'Buɗe jakar',
    'card.breathing': 'Numfashi',
    'card.breathingText': 'Sake nutsuwa da dan lokaci.',
    'card.breathe': 'Numfashi',
    'card.meditation': 'Tunani',
    'card.meditationText': 'Bari hankali ya huta ya koma numfashi.',
    'card.meditationButton': 'Tunani',
    'dashboard.growth': 'Ci gaban kanka',
    'dashboard.logWin': 'Rubuta nasara',
    'dashboard.weekly': 'Ci gaban mako',
    'dashboard.monthly': 'Ci gaban wata',
    'dashboard.streak': 'ranar jere',
    'dashboard.notifications': 'Sanarwa',
    'dashboard.todayQuote': 'Maganar yau',
    'profile.title': 'Bayanan martaba',
    'profile.name': 'Sunan nunawa',
    'profile.pronouns': 'Sunayen wakilci',
    'profile.greeting': 'Gaisuwa',
    'profile.bio': 'Takaitaccen bayani',
    'profile.focus': 'Abin da kake mai da hankali a kai',
    'profile.save': 'Ajiye bayanan martaba',
    'settings.title': 'Saituna',
    'settings.theme': 'Jigo',
    'settings.daily': 'Sanarwa ta kullum',
    'settings.private': 'Yanayin sirri (kada a adana sabbin tattaunawa)',
    'settings.reminders': 'Tunatarwa mai laushi',
    'settings.motion': 'Rage motsi',
    'settings.memory': 'Ajiye tattaunawa a tarihin asusuna (na zaɓi)',
    'settings.save': 'Ajiye saituna',
    'settings.reset': 'Mayar da tsoffin saituna',
    'settings.data': 'Bayanan ka da asusu',
    'settings.export': 'Fitar da bayanana',
    'settings.signOut': 'Fita',
    'settings.delete': 'Goge asusu da bayanai',
    'safe.title': 'An tsara shi domin aminci',
    'safe.peopleFirst': 'Mutane da farko'
  },
  ig: {
    'landing.ctaPrimary': 'Bido njem gi',
    'landing.ctaSecondary': 'Lelee Noracle',
    'time.goodEvening': 'Ị mara mma',
    'page.hello': 'Ndewo, gị.',
    'nav.language': 'Asụsụ',
    'nav.home': 'Ụlọ',
    'nav.profile': 'Profaịlụ',
    'nav.settings': 'Ntọala',
    'nav.nora': 'Nora AI',
    'nav.therapist': 'Ndị dọkịta',
    'nav.community': 'Ndị otu',
    'nav.scream': 'Ụlọ mkpu',
    'nav.meditate': 'Medita',
    'nav.breathing': 'Mfe ikuku',
    'nav.journal': 'Journal',
    'nav.mood': 'Ọnọdụ uche',
    'nav.backpack': 'Akpa Mmụọ',
    'nav.maskOff': 'Mask Off',
    'nav.vault': 'Akwụ',
    'nav.budget': 'Mkparịta ego',
    'card.nora': 'Nora',
    'card.noraText': 'Lelee echiche gị ma chọpụta ihe na-ebu gị.',
    'card.openNora': 'Mepee Nora',
    'card.mood': 'Ọnọdụ',
    'card.moodText': 'Kedu ọnọdụ gị taa?',
    'card.trackMood': 'Lelee ọnọdụ',
    'card.journal': 'Journal',
    'card.journalText': 'Dee ihe na-eme gị n’obi.',
    'card.openJournal': 'Mepee journal',
    'card.maskOff': 'Mask Off',
    'card.maskOffText': 'Kwu ihe ị na-ebu naanị gị.',
    'card.maskOffButton': 'Mepee Mask Off',
    'card.backpack': 'Akpa Mmụọ',
    'card.backpackText': 'Lelee ihe ị na-ebu wee mee ka obere ibu daa.',
    'card.backpackButton': 'Mepee akpa',
    'card.breathing': 'Mfe ikuku',
    'card.breathingText': 'Weghachite nchekasị na nkịtị.',
    'card.breathe': 'Mfe',
    'card.meditation': 'Medita',
    'card.meditationText': 'Kwe ka uche dajụọ ma laghachi na ume.',
    'card.meditationButton': 'Medita',
    'dashboard.growth': 'Ọganihu',
    'dashboard.logWin': 'Dee ihe ị mere nke ọma',
    'dashboard.weekly': 'Ọganihu izu',
    'dashboard.monthly': 'Ọganihu ọnwa',
    'dashboard.streak': 'ụbọchị n’usoro',
    'dashboard.notifications': 'Ozi amamọkwa',
    'dashboard.todayQuote': 'Okwu taa',
    'profile.title': 'Profaịlụ',
    'profile.name': 'Aha ngosi',
    'profile.pronouns': 'Nnọchiaha',
    'profile.greeting': 'Ekele',
    'profile.bio': 'Nkọwa dị mkpirikpi',
    'profile.focus': 'Ihe ị na-elekwasị anya',
    'profile.save': 'Chekwaa profaịlụ',
    'settings.title': 'Ntọala',
    'settings.theme': 'Ọdịdị',
    'settings.daily': 'Ozi kwa ụbọchị',
    'settings.private': 'Ụdị nzuzo (echekwala mkparịta ụka ọhụrụ)',
    'settings.reminders': 'Nchetara dị nro',
    'settings.motion': 'Belata mmegharị',
    'settings.memory': 'Chekwaa mkparịta ụka na akụkọ akaụntụ m (nhọrọ)',
    'settings.save': 'Chekwaa ntọala',
    'settings.reset': 'Tọgharịa ntọala mbụ',
    'settings.data': 'Data gị na akaụntụ gị',
    'settings.export': 'Budata data m',
    'settings.signOut': 'Pụọ',
    'settings.delete': 'Hichapụ akaụntụ na data',
    'safe.title': 'E mere ya maka nchekwa',
    'safe.peopleFirst': 'Ndị mmadụ ụzọ mbụ'
  },
  yo: {
    'landing.ctaPrimary': 'Bẹ̀rẹ̀ ìrìnàjò rẹ',
    'landing.ctaSecondary': 'Wàá Noracle',
    'time.goodEvening': 'E kaaro',
    'page.hello': 'Bawoni, o.',
    'nav.language': 'Èdè',
    'nav.home': 'Ilé',
    'nav.profile': 'Àkọọlẹ',
    'nav.settings': 'Ètò',
    'nav.nora': 'Nora AI',
    'nav.therapist': 'Onímọ̀ràn gidi',
    'nav.community': 'Àwọn ẹgbẹ',
    'nav.scream': 'Yàrá ìkúnsìn',
    'nav.meditate': 'Àrò',
    'nav.breathing': 'Ìfàà',
    'nav.journal': 'Ìwé ojú',
    'nav.mood': 'Ìrírẹ',
    'nav.backpack': 'Ápo ìmọ̀ràn',
    'nav.maskOff': 'Mask Off',
    'nav.vault': 'Awo',
    'nav.budget': 'Ìròṣòro ináwó',
    'card.nora': 'Nora',
    'card.noraText': 'Ṣàkíyèsí àwọn ìrònú rẹ ki o sì mọ ohun tí ń wu ọ.',
    'card.openNora': 'Ṣi Nora',
    'card.mood': 'Ìrírẹ',
    'card.moodText': 'Báwo ni ìrírẹ rẹ lónìí?',
    'card.trackMood': 'Tẹ̀sí i',
    'card.journal': 'Ìwé ojú',
    'card.journalText': 'Kọ ohun tí o fẹ́ sọ.',
    'card.openJournal': 'Ṣi ìwé ojú',
    'card.maskOff': 'Mask Off',
    'card.maskOffText': 'Sọ ọ̀kan tí o ti ń gbé pẹ̀lú ara rẹ.',
    'card.maskOffButton': 'Ṣi Mask Off',
    'card.backpack': 'Ápo ìmọ̀ràn',
    'card.backpackText': 'Wo ohun tí o ń gbé, ki o sì dẹ́rọ̀rùn kan.',
    'card.backpackButton': 'Ṣi apo',
    'card.breathing': 'Ìfàà',
    'card.breathingText': 'Sàlà àìsàn ni àkókò kàn.',
    'card.breathe': 'Ìfàà',
    'card.meditation': 'Àrò',
    'card.meditationText': 'Jẹ́ ki ọ̀kan rẹ sinmi tí o sì padà sí ìfàà.',
    'card.meditationButton': 'Àrò',
    'dashboard.growth': 'Ìlọsíwájú',
    'dashboard.logWin': 'Kọ àṣeyọrí kan',
    'dashboard.weekly': 'Ìlọsíwájú ọ̀sẹ̀',
    'dashboard.monthly': 'Ìlọsíwájú oṣù',
    'dashboard.streak': 'ọjọ́ lẹ́sẹẹsẹ',
    'dashboard.notifications': 'Àwọn ìfitónilétí',
    'dashboard.todayQuote': 'Ọ̀rọ̀ òní',
    'profile.title': 'Àkọọlẹ',
    'profile.name': 'Orúkọ ìfihàn',
    'profile.pronouns': 'Àropò orúkọ',
    'profile.greeting': 'Ìkíni',
    'profile.bio': 'Àlàyé kúkúrú',
    'profile.focus': 'Ohun tí o ń fojú sí',
    'profile.save': 'Fi àkọọlẹ pamọ́',
    'settings.title': 'Ètò',
    'settings.theme': 'Àwòrán',
    'settings.daily': 'Ìfitónilétí ojoojúmọ́',
    'settings.private': 'Àṣírí (má ṣe fi àwọn ìjíròrò tuntun pamọ́)',
    'settings.reminders': 'Àwọn ìrántí pẹ̀lẹ́',
    'settings.motion': 'Dín ìṣípo kù',
    'settings.memory': 'Fi àwọn ìjíròrò pamọ́ sínú àkọsílẹ̀ àkọọlẹ mi (àṣàyàn)',
    'settings.save': 'Fi ètò pamọ́',
    'settings.reset': 'Padà sí ètò àkọ́kọ́',
    'settings.data': 'Àwọn dátà àti àkọọlẹ rẹ',
    'settings.export': 'Gba dátà mi jáde',
    'settings.signOut': 'Jáde',
    'settings.delete': 'Pa àkọọlẹ àti dátà rẹ́',
    'safe.title': 'A ṣe é pẹ̀lú ààbò lọ́kàn',
    'safe.peopleFirst': 'Ènìyàn kọ́kọ́'
  },
  pcm: {
    'landing.ctaPrimary': 'Start your journey',
    'landing.ctaSecondary': 'Explore Noracle',
    'time.goodEvening': 'Good evening',
    'page.hello': 'Hello, you.',
    'nav.language': 'Language',
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.nora': 'Nora AI',
    'nav.therapist': 'Real therapist',
    'nav.community': 'Communities',
    'nav.scream': 'Scream room',
    'nav.meditate': 'Meditate',
    'nav.breathing': 'Breathing',
    'nav.journal': 'Journal',
    'nav.mood': 'Mood',
    'nav.backpack': 'Emotional Backpack',
    'nav.maskOff': 'Mask Off',
    'nav.vault': 'Vault',
    'nav.budget': 'Budget Whisperer',
    'card.nora': 'Nora',
    'card.noraText': 'Check your mind and notice wetin dey heavy for you.',
    'card.openNora': 'Open Nora',
    'card.mood': 'Mood',
    'card.moodText': 'How you dey feel today?',
    'card.trackMood': 'Track mood',
    'card.journal': 'Journal',
    'card.journalText': 'Write wetin dey your mind.',
    'card.openJournal': 'Open journal',
    'card.maskOff': 'Mask Off',
    'card.maskOffText': 'Talk the part wey you don dey carry alone.',
    'card.maskOffButton': 'Open Mask Off',
    'card.backpack': 'Emotional Backpack',
    'card.backpackText': 'Notice wetin you carry and make the load softer.',
    'card.backpackButton': 'Open backpack',
    'card.breathing': 'Breathing',
    'card.breathingText': 'Reset with small pause.',
    'card.breathe': 'Breathe',
    'card.meditation': 'Meditation',
    'card.meditationText': 'Let your mind settle and come back to breath.',
    'card.meditationButton': 'Meditate',
    'dashboard.growth': 'Growth tracker',
    'dashboard.logWin': 'Log one win',
    'dashboard.weekly': 'Weekly progress',
    'dashboard.monthly': 'Monthly progress',
    'dashboard.streak': 'day streak',
    'dashboard.notifications': 'Notification centre',
    'dashboard.todayQuote': 'Today’s quote',
    'profile.title': 'Profile',
    'profile.name': 'Display name',
    'profile.pronouns': 'Pronouns',
    'profile.greeting': 'Greeting',
    'profile.bio': 'Small bio',
    'profile.focus': 'Wetin you dey focus on',
    'profile.save': 'Save profile',
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.daily': 'Daily notifications',
    'settings.private': 'Private mode (no save new conversations)',
    'settings.reminders': 'Gentle reminders',
    'settings.motion': 'Reduce movement',
    'settings.memory': 'Save conversations for my account history (optional)',
    'settings.save': 'Save settings',
    'settings.reset': 'Reset to default settings',
    'settings.data': 'Your account and your data',
    'settings.export': 'Export my data',
    'settings.signOut': 'Sign out',
    'settings.delete': 'Delete account and data',
    'safe.title': 'Safe by design',
    'safe.peopleFirst': 'People first'
  }
};

const ensureComet = () => {
  if (document.querySelector('.comet')) return;

  const comet = document.createElement('div');
  comet.className = 'comet';
  comet.setAttribute('aria-hidden', 'true');
  document.body.appendChild(comet);
};

const applyTheme = (theme) => {
  const allowedThemes = ['light-starry', 'dusk', 'gold'];
  const selectedTheme = allowedThemes.includes(theme) ? theme : 'light-starry';
  document.body.classList.remove('theme-dusk', 'theme-gold', 'theme-light-starry');
  document.body.classList.add(`theme-${selectedTheme}`);
  if (localStorage.getItem(storageKey) !== selectedTheme) {
    localStorage.setItem(storageKey, selectedTheme);
  }
  const settings = readPreferenceSettings();
  if (settings.theme !== selectedTheme) {
    localStorage.setItem(settingsKey, JSON.stringify({ ...settings, theme: selectedTheme }));
  }
  const themeSelect = document.getElementById('settings-theme');
  if (themeSelect) themeSelect.value = selectedTheme;
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    const themeNames = { 'light-starry': 'Light starry', dusk: 'Dusk', gold: 'Golden glow' };
    toggle.setAttribute('aria-label', `Change color theme. Current theme: ${themeNames[selectedTheme]}.`);
    toggle.setAttribute('title', `Current theme: ${themeNames[selectedTheme]}`);
  }
};

const readPreferenceSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(settingsKey) || '{}');
    return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  } catch (_error) {
    return {};
  }
};

const applyReducedMotion = (settings = readPreferenceSettings()) => {
  document.documentElement.classList.toggle('user-reduced-motion', settings.reducedMotion === true);
};

const chooseTheme = () => {
  const saved = localStorage.getItem(storageKey) || readPreferenceSettings().theme;
  const preferred = saved || 'light-starry';
  applyTheme(preferred);
};

const applyTranslations = (lang = localStorage.getItem(languageKey) || 'en') => {
  const selectedLanguage = Object.hasOwn(translations, lang) ? lang : 'en';
  const dictionary = translations[selectedLanguage];
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const value = dictionary[key] || translations.en[key];
    if (value) element.textContent = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.getAttribute('data-i18n-placeholder');
    const value = dictionary[key] || translations.en[key];
    if (value) element.setAttribute('placeholder', value);
  });

  document.documentElement.lang = selectedLanguage;
  document.querySelectorAll('#language-select, #settings-language').forEach((select) => {
    select.value = selectedLanguage;
  });
};

const setLanguage = (lang) => {
  const selectedLanguage = Object.hasOwn(translations, lang) ? lang : 'en';
  localStorage.setItem(languageKey, selectedLanguage);
  localStorage.setItem(settingsKey, JSON.stringify({
    ...readPreferenceSettings(),
    language: selectedLanguage
  }));
  applyTranslations(selectedLanguage);
  return selectedLanguage;
};

window.NoraclePreferences = Object.freeze({
  languageCodes: Object.freeze(['en', 'pcm', 'yo', 'ig', 'ha']),
  themeNames: Object.freeze(['light-starry', 'dusk', 'gold']),
  setLanguage,
  setTheme: applyTheme
});

const bindRouteButtons = () => {
  document.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-route');
      if (target) window.location.href = target;
    });
  });
};

const initThemeToggle = () => {
  let toggle = document.querySelector('#theme-toggle');
  if (!toggle) {
    const preferences = document.createElement('div');
    preferences.className = 'global-preferences';
    preferences.setAttribute('aria-label', 'Display and language preferences');
    toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'icon-button';
    toggle.type = 'button';
    preferences.appendChild(toggle);
    document.body.appendChild(preferences);
  }
  toggle.setAttribute('aria-label', 'Change color theme');
  toggle.setAttribute('title', 'Change color theme');
  toggle.textContent = '◐';
  const activeTheme = ['light-starry', 'dusk', 'gold'].find((theme) => document.body.classList.contains(`theme-${theme}`)) || 'light-starry';
  const themeNames = { 'light-starry': 'Light starry', dusk: 'Dusk', gold: 'Golden glow' };
  toggle.setAttribute('aria-label', `Change color theme. Current theme: ${themeNames[activeTheme]}.`);
  toggle.setAttribute('title', `Current theme: ${themeNames[activeTheme]}`);
  toggle.addEventListener('click', () => {
    const current = ['light-starry', 'dusk', 'gold'].find((theme) => document.body.classList.contains(`theme-${theme}`)) || 'light-starry';
    const themes = ['light-starry', 'dusk', 'gold'];
    applyTheme(themes[(themes.indexOf(current) + 1) % themes.length]);
  });
};

const initLanguageSelector = () => {
  const selects = [...document.querySelectorAll('#language-select, #settings-language')];
  if (selects.length === 0) {
    let preferences = document.querySelector('.global-preferences');
    if (!preferences) {
      preferences = document.createElement('div');
      preferences.className = 'global-preferences';
      preferences.setAttribute('aria-label', 'Display and language preferences');
      document.body.appendChild(preferences);
    }
    const label = document.createElement('label');
    label.className = 'global-language';
    label.htmlFor = 'language-select';
    label.setAttribute('data-i18n', 'nav.language');
    label.textContent = 'Language';
    const select = document.createElement('select');
    select.id = 'language-select';
    select.setAttribute('aria-label', 'Choose language');
    [
      ['en', 'English'],
      ['pcm', 'Nigerian Pidgin'],
      ['yo', 'Yorùbá'],
      ['ig', 'Igbo'],
      ['ha', 'Hausa']
    ].forEach(([code, name]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = name;
      select.appendChild(option);
    });
    preferences.append(label, select);
    selects.push(select);
  }
  const settingsLanguage = readPreferenceSettings().language;
  const storedLanguage = localStorage.getItem(languageKey);
  const saved = Object.hasOwn(translations, storedLanguage) ? storedLanguage
    : Object.hasOwn(translations, settingsLanguage) ? settingsLanguage : 'en';
  selects.forEach((select) => {
    select.value = saved;
    select.addEventListener('change', (event) => {
      setLanguage(event.target.value);
    });
  });
  setLanguage(saved);
};

const initSettingsThemeSelector = () => {
  const select = document.getElementById('settings-theme');
  if (!select) return;
  select.addEventListener('change', (event) => applyTheme(event.target.value));
};

applyReducedMotion();

const getGrowthState = () => {
  const base = {
    weekly: 0,
    monthly: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString().slice(0, 10)
  };

  const existing = JSON.parse(localStorage.getItem(growthKey) || '{}');
  const today = new Date().toISOString().slice(0, 10);
  const next = { ...base, ...existing };
  if (next.lastActiveDate !== today) {
    next.streak = (Number(next.streak) || 0) + 1;
    next.lastActiveDate = today;
    localStorage.setItem(growthKey, JSON.stringify(next));
  }

  return next;
};

const updateGrowthUI = () => {
  const weeklyScore = document.getElementById('weekly-score');
  const monthlyScore = document.getElementById('monthly-score');
  const weeklyBar = document.getElementById('weekly-bar');
  const monthlyBar = document.getElementById('monthly-bar');
  const streakCount = document.getElementById('streak-count');

  if (!weeklyScore || !monthlyScore || !weeklyBar || !monthlyBar || !streakCount) return;

  const state = getGrowthState();
  const tracker = weeklyScore.closest('.tracker-card');
  if (tracker && !document.getElementById('growth-local-only-note')) {
    const note = document.createElement('p');
    note.id = 'growth-local-only-note';
    note.className = 'status-text';
    note.textContent = 'This progress is stored only in this browser on this device. It is not synced to an account.';
    tracker.appendChild(note);
  }
  const weekly = Math.min(100, Number(state.weekly) || 0);
  const monthly = Math.min(100, Number(state.monthly) || 0);

  weeklyScore.textContent = `${weekly}%`;
  monthlyScore.textContent = `${monthly}%`;
  weeklyBar.style.width = `${weekly}%`;
  monthlyBar.style.width = `${monthly}%`;
  streakCount.textContent = String(Number(state.streak) || 0);
};

const logGrowth = () => {
  const baseState = getGrowthState();
  const nextState = {
    ...baseState,
    weekly: Math.min(100, Number(baseState.weekly) + 5),
    monthly: Math.min(100, Number(baseState.monthly) + 4),
    streak: Number(baseState.streak) + 1,
    lastActiveDate: new Date().toISOString().slice(0, 10)
  };

  localStorage.setItem(growthKey, JSON.stringify(nextState));
  updateGrowthUI();
};

const getDailyQuote = () => {
  const today = new Date().toISOString().slice(0, 10);
  const saved = JSON.parse(localStorage.getItem(quoteKey) || 'null');

  if (saved && saved.date === today && saved.quote) {
    return saved.quote;
  }

  const quote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
  localStorage.setItem(quoteKey, JSON.stringify({ date: today, quote }));
  return quote;
};

const initNotificationCentre = () => {
  const toggle = document.getElementById('notification-toggle');
  const showButton = document.getElementById('show-quote');
  const quoteBox = document.getElementById('notification-quote');

  if (quoteBox) {
    quoteBox.textContent = `“${getDailyQuote()}”`;
  }

  const reveal = () => {
    if (!quoteBox) return;
    quoteBox.textContent = `“${getDailyQuote()}”`;
    quoteBox.classList.add('visible');
  };

  if (toggle) toggle.addEventListener('click', reveal);
  if (showButton) showButton.addEventListener('click', reveal);
};

const initGrowthTracker = () => {
  const button = document.getElementById('log-growth');
  if (button) {
    button.addEventListener('click', logGrowth);
  }
  updateGrowthUI();
};

const initSidebarToggle = () => {
  const toggle = document.getElementById('sidebar-toggle');
  const layout = document.querySelector('.app-layout');
  if (!toggle || !layout) return;

  const collapsed = localStorage.getItem(sidebarKey) === 'true';
  layout.classList.toggle('sidebar-collapsed', collapsed);
  toggle.setAttribute('aria-expanded', String(!collapsed));
  toggle.addEventListener('click', () => {
    const shouldCollapse = !layout.classList.contains('sidebar-collapsed');
    layout.classList.toggle('sidebar-collapsed', shouldCollapse);
    localStorage.setItem(sidebarKey, String(shouldCollapse));
    toggle.setAttribute('aria-expanded', String(!shouldCollapse));
  });
};

ensureComet();
chooseTheme();
bindRouteButtons();
initThemeToggle();
initLanguageSelector();
initSettingsThemeSelector();
window.addEventListener('storage', (event) => {
  if (event.key === storageKey && event.newValue) applyTheme(event.newValue);
  if (event.key === languageKey && event.newValue) applyTranslations(event.newValue);
  if (event.key === settingsKey) {
    let settings = {};
    try {
      settings = event.newValue ? JSON.parse(event.newValue) : {};
    } catch (_error) {
      settings = {};
    }
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) settings = {};
    applyReducedMotion(settings);
    if (settings.theme && settings.theme !== localStorage.getItem(storageKey)) {
      applyTheme(settings.theme);
    }
    if (settings.language && settings.language !== localStorage.getItem(languageKey)) {
      applyTranslations(settings.language);
    }
  }
});
initGrowthTracker();
initNotificationCentre();
initSidebarToggle();
