import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources: {},
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const loadTranslations = async () => {
  const enTranslations = await fetch('/locales/en.json').then((res) => res.json());
  const swTranslations = await fetch('/locales/sw.json').then((res) => res.json());

  i18n.addResourceBundle('en', 'translation', enTranslations);
  i18n.addResourceBundle('sw', 'translation', swTranslations);
};

loadTranslations();

export default i18n;
