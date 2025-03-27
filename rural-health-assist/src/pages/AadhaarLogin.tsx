
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceGuidance from '@/components/VoiceGuidance';
import Header from '@/components/Header';
import TouchKeyboard from '@/components/TouchKeyboard';

const AadhaarLogin: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [aadhaar, setAadhaar] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);

  const formatAadhaarNumber = (input: string) => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '');
    
    // Format with hyphens after every 4 digits
    let formattedNumber = '';
    for (let i = 0; i < numbers.length && i < 12; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedNumber += '-';
      }
      formattedNumber += numbers[i];
    }
    
    return formattedNumber;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedAadhaar = formatAadhaarNumber(e.target.value);
    setAadhaar(formattedAadhaar);
  };

  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      // Remove the last character
      setAadhaar(prev => {
        const withoutHyphens = prev.replace(/-/g, '');
        if (withoutHyphens.length <= 1) return '';
        const newValue = withoutHyphens.slice(0, -1);
        return formatAadhaarNumber(newValue);
      });
    } else {
      // Add the pressed key
      setAadhaar(prev => {
        const withoutHyphens = prev.replace(/-/g, '');
        if (withoutHyphens.length >= 12) return prev; // Max 12 digits
        const newValue = withoutHyphens + key;
        return formatAadhaarNumber(newValue);
      });
    }
  };

  const handleSubmit = () => {
    // Remove hyphens for validation
    const cleanAadhaar = aadhaar.replace(/-/g, '');
    
    if (cleanAadhaar.length === 12) {
      // In a real app, you would verify the Aadhaar here
      // For this demo, we'll just navigate to the next screen
      navigate('/registration');
    } else {
      // Show error message
      alert(t('कृपया 12 अंकों का आधार नंबर दर्ज करें।', 'Please enter a 12-digit Aadhaar number.'));
    }
  };

  const playHelpPrompt = () => {
    // In a real app, this would play a detailed voice guidance
    console.log("Help guidance playing");
  };

  const handleFocus = () => {
    setShowKeyboard(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <rect width="18" height="14" x="3" y="5" rx="2" />
                <path d="M21 8v8" />
                <path d="M7 8v.01" />
                <path d="m12 16 5-5" />
                <path d="m12 11 5 5" />
              </svg>
            </div>
            
            <h1 className="kiosk-large-text text-center font-hindi">
              {t('आधार नंबर डालें', 'Enter Aadhaar Number')}
            </h1>
          </div>
          
          <div className="w-full">
            <label htmlFor="aadhaar" className="kiosk-medium-text block mb-2 font-hindi">
              {t('आधार नंबर', 'Aadhaar Number')}
            </label>
            <input
              id="aadhaar"
              type="text"
              value={aadhaar}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder="XXXX-XXXX-XXXX"
              className="kiosk-input w-full mb-4 text-center"
              maxLength={14} // 12 digits + 2 hyphens
            />
            <p className="text-gray-500 text-center mb-6">
              {t('उदाहरण: 1234-5678-9012', 'Example: 1234-5678-9012')}
            </p>
          </div>
          
          {showKeyboard && (
            <TouchKeyboard 
              onKeyPress={handleKeyPress} 
              onSubmit={handleSubmit}
              type="numeric"
              showKeyboard={showKeyboard}
            />
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
            <button 
              onClick={playHelpPrompt}
              className="kiosk-button-large kiosk-button-red order-2 sm:order-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span className="font-hindi">{t('मदद', 'Help')}</span>
            </button>
            
            <button 
              onClick={handleSubmit}
              className="kiosk-button-large kiosk-button-green order-1 sm:order-2"
            >
              <span className="font-hindi">{t('आगे बढ़ें', 'Next')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <VoiceGuidance
            hindiPrompt="अपना आधार नंबर डालें और हरे बटन को दबाएँ।"
            englishPrompt="Enter your Aadhaar number and press the green button."
          />
        </div>
      </div>
    </div>
  );
};

export default AadhaarLogin;
