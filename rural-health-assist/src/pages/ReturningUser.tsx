
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceGuidance from '@/components/VoiceGuidance';
import Header from '@/components/Header';

const ReturningUser: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleYes = () => {
    // In a real app, this would show previous prescriptions
    // For this demo, we'll just show an alert
    alert(t(
      'पुराना प्रिस्क्रिप्शन यहां दिखाया जाएगा। QR कोड के साथ।',
      'Previous prescription would be shown here. With QR code.'
    ));
    
    // Then navigate to symptoms page
    navigate('/symptoms');
  };

  const handleNo = () => {
    // Navigate to symptoms input page
    navigate('/symptoms');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-purple-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                <path d="M9 17h6" />
                <path d="M9 13h6" />
              </svg>
            </div>
            
            <h1 className="kiosk-large-text text-center font-hindi">
              {t('पिछला प्रिस्क्रिप्शन देखें?', 'View past prescription?')}
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 w-full justify-center">
            <button 
              onClick={handleYes}
              className="kiosk-button-large kiosk-button-green"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="font-hindi">{t('हाँ', 'Yes')}</span>
            </button>
            
            <button 
              onClick={handleNo}
              className="kiosk-button-large bg-gray-500 text-white hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="font-hindi">{t('नहीं', 'No')}</span>
            </button>
          </div>
          
          <VoiceGuidance
            hindiPrompt="क्या आप पुरानी दवाएं देखना चाहते हैं? हाँ के लिए हरा बटन दबाएँ।"
            englishPrompt="Do you want to see your past prescriptions? Press the green button for Yes."
          />
        </div>
      </div>
    </div>
  );
};

export default ReturningUser;
