
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceGuidance from '@/components/VoiceGuidance';

const LanguageSelection: React.FC = () => {
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();

  const selectLanguage = (lang: 'hindi' | 'english') => {
    setLanguage(lang);
    navigate('/aadhaar-login');
  };

  return (
    <div className="kiosk-container">
      <div className="flex flex-col items-center justify-center gap-8 w-full">
        <div className="flex flex-col items-center gap-4">
          <img 
            src="/india-flag.svg" 
            alt="Indian Flag" 
            className="w-24 h-24 rounded-full object-cover shadow-md"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMjUgMTUwIj48cmVjdCB3aWR0aD0iMjI1IiBoZWlnaHQ9IjUwIiBmaWxsPSIjRkY5OTMzIi8+PHJlY3QgeT0iNTAiIHdpZHRoPSIyMjUiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB5PSIxMDAiIHdpZHRoPSIyMjUiIGhlaWdodD0iNTAiIGZpbGw9IiMxMzhEMDAiLz48Y2lyY2xlIGN4PSIxMTIuNSIgY3k9Ijc1IiByPSIyMCIgZmlsbD0iIzAwMDA4MCIvPjwvc3ZnPg==';
            }}
          />
          <h1 className="kiosk-large-text font-hindi mb-8 text-center">
            भाषा चुनें / Choose Language
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-md justify-center">
          <button 
            onClick={() => selectLanguage('hindi')}
            className="kiosk-button-large kiosk-button-green"
          >
            <span className="text-3xl">🇮🇳</span>
            <span className="font-hindi">हिंदी</span>
          </button>
          
          <button 
            onClick={() => selectLanguage('english')}
            className="kiosk-button-large kiosk-button-blue"
          >
            <span className="text-3xl">🇬🇧</span>
            <span>English</span>
          </button>
        </div>

        <VoiceGuidance 
          hindiPrompt="कृपया अपनी भाषा चुनें। हिंदी के लिए हरे बटन को दबाएँ।" 
          englishPrompt="Please select your language. Press the green button for Hindi."
        />
      </div>
    </div>
  );
};

export default LanguageSelection;
