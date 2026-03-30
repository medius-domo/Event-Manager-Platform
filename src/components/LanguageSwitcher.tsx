import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
      <Languages className="w-4 h-4 text-gray-600" />
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded font-medium text-sm transition ${
          i18n.language === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('sw')}
        className={`px-3 py-1 rounded font-medium text-sm transition ${
          i18n.language === 'sw'
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        SW
      </button>
    </div>
  );
}
