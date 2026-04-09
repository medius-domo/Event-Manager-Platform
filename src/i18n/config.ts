import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {} },
    sw: { translation: {} },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const loadTranslations = async () => {
  try {
    const [enTranslations, swTranslations] = await Promise.all([
      fetch('/locales/en.json').then((res) => res.json()),
      fetch('/locales/sw.json').then((res) => res.json()),
    ]);

    i18n.addResourceBundle('en', 'translation', enTranslations, true, true);
    i18n.addResourceBundle('sw', 'translation', swTranslations, true, true);
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
};

loadTranslations();

export default i18n;
