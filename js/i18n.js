const localeFiles = {
  en: './locales/en.json',
  pcm: './locales/pcm.json',
  yo: './locales/yo.json',
  ig: './locales/ig.json',
  ha: './locales/ha.json'
};

export async function loadLocale(code = 'en') {
  const file = localeFiles[code] || localeFiles.en;
  const response = await fetch(file);
  return response.json();
}
