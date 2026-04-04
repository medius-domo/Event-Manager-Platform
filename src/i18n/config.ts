import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLanguage = typeof window !== 'undefined'
  ? localStorage.getItem('language') || 'en'
  : 'en';

const loadTranslations = async () => {
  try {
    const enTranslations = await fetch('/locales/en.json').then((res) => res.json());
    const swTranslations = await fetch('/locales/sw.json').then((res) => res.json());

    await i18n.use(initReactI18next).init({
      resources: {
        en: { translation: enTranslations },
        sw: { translation: swTranslations },
      },
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    console.error('Failed to load translations:', error);
    await i18n.use(initReactI18next).init({
      resources: {
        en: { translation: {} },
        sw: { translation: {} },
      },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
  }
};

loadTranslations();

export default i18n;
