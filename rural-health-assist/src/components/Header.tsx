
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'hindi' ? 'english' : 'hindi');
  };

  return (
    <header className="w-full p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img 
          src="/health-kiosk-logo.svg" 
          alt="Health Kiosk Logo" 
          className="h-10 w-10"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNEQzOTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjIgMTJoLTRsLTMgOUw5IDNsLTMgOUgyIi8+PC9zdmc+';
          }}
        />
        <span className="font-bold text-lg">{t("स्वास्थ्य किओस्क", "Health Kiosk")}</span>
      </div>
      
      <button 
        onClick={toggleLanguage}
        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-1"
      >
        {language === 'hindi' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
      </button>
    </header>
  );
};

export default Header;
