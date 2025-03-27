
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceGuidance from '@/components/VoiceGuidance';
import Header from '@/components/Header';
import { Doctor } from '@/utils/doctorUtils';

const DoctorCall: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get doctor from location state
  const doctor = location.state?.doctor as Doctor | undefined;
  const diagnosis = location.state?.diagnosis;
  const symptoms = location.state?.symptoms || [];
  
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'completed'>('connecting');
  const [timer, setTimer] = useState(0);
  const [prescription, setPrescription] = useState<string | null>(null);

  // Simulate call connecting and then connected
  useEffect(() => {
    const connectingTimeout = setTimeout(() => {
      setCallStatus('connected');
    }, 3000);
    
    return () => clearTimeout(connectingTimeout);
  }, []);

  // Start timer when call is connected
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('completed');
    setPrescription('dummy-prescription-qr-code');
  };

  const handleDownloadPrescription = () => {
    // In a real app, this would generate and download the prescription
    alert(t(
      'प्रिस्क्रिप्शन डाउनलोड हो गया है',
      'Prescription has been downloaded'
    ));
  };

  const handleNewConsultation = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          {callStatus === 'connecting' && (
            <>
              <div className="animate-pulse-soft flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-full relative">
                  {doctor?.avatarUrl ? (
                    <img 
                      src={doctor.avatarUrl} 
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  )}
                </div>
                
                <h1 className="kiosk-large-text text-center font-hindi">
                  {doctor 
                    ? t(`${doctor.name} से जुड़ रहे हैं`, `Connecting to ${doctor.name}`) 
                    : t('डॉक्टर से जुड़ रहे हैं', 'Connecting to Doctor')}
                </h1>
                
                {diagnosis && (
                  <p className="text-center text-gray-600 font-hindi">
                    {t(`निदान: ${diagnosis}`, `Diagnosis: ${diagnosis}`)}
                  </p>
                )}
                
                <div className="flex justify-center items-center gap-2 mt-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </>
          )}
          
          {callStatus === 'connected' && (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-green-50 rounded-full">
                  {doctor?.avatarUrl ? (
                    <img 
                      src={doctor.avatarUrl} 
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  )}
                </div>
                
                <h1 className="kiosk-large-text text-center font-hindi">
                  {doctor 
                    ? t(`${doctor.name} से बात चल रही है`, `Call with ${doctor.name} in Progress`) 
                    : t('डॉक्टर से बात चल रही है', 'Call in Progress')}
                </h1>
                
                <div className="bg-gray-100 px-6 py-3 rounded-full text-2xl font-mono">
                  ⏱ {formatTime(timer)}
                </div>
              </div>
              
              {symptoms.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl w-full">
                  <h3 className="font-medium mb-2 font-hindi text-center">
                    {t('आपके बताए लक्षण:', 'Your Reported Symptoms:')}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {symptoms.map((symptom: string, index: number) => (
                      <li key={index} className="font-hindi">{symptom}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-6 w-full">
                <button 
                  onClick={handleEndCall}
                  className="kiosk-button-large kiosk-button-red w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                  <span className="font-hindi">{t('कॉल समाप्त करें', 'End Call')}</span>
                </button>
              </div>
            </>
          )}
          
          {callStatus === 'completed' && (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-green-50 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                    <path d="M9 9h1" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                  </svg>
                </div>
                
                <h1 className="kiosk-large-text text-center font-hindi">
                  {t('प्रिस्क्रिप्शन तैयार है', 'Prescription Ready')}
                </h1>
              </div>
              
              <div className="w-full flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-xs">
                  {/* This would be a real QR code in the actual implementation */}
                  <div className="bg-gray-200 aspect-square w-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <path d="M8 8h.01" />
                      <path d="M12 8h.01" />
                      <path d="M16 8h.01" />
                      <path d="M8 12h.01" />
                      <path d="M12 12h.01" />
                      <path d="M16 12h.01" />
                      <path d="M8 16h.01" />
                      <path d="M12 16h.01" />
                      <path d="M16 16h.01" />
                    </svg>
                  </div>
                </div>
                
                <p className="text-center text-lg font-hindi">
                  {t('इसे दवा की दुकान पर दिखाएँ', 'Show at pharmacy')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
                <button 
                  onClick={handleDownloadPrescription}
                  className="kiosk-button-large kiosk-button-green flex-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  <span className="font-hindi">{t('डाउनलोड', 'Download')}</span>
                </button>
                
                <button 
                  onClick={handleNewConsultation}
                  className="kiosk-button-large bg-blue-500 text-white hover:bg-blue-600 flex-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  <span className="font-hindi">{t('नई कंसल्टेशन', 'New Consultation')}</span>
                </button>
              </div>
            </>
          )}
          
          <VoiceGuidance
            hindiPrompt={
              callStatus === 'connecting'
                ? doctor 
                  ? `${doctor.name} से जुड़ रहे हैं, कृपया प्रतीक्षा करें।`
                  : "डॉक्टर से जुड़ रहे हैं, कृपया प्रतीक्षा करें।"
                : callStatus === 'connected'
                  ? doctor
                    ? `${doctor.name} आपसे बात करेंगे। कॉल खत्म करने के लिए लाल बटन दबाएँ।`
                    : "डॉक्टर आपसे बात करेंगे। कॉल खत्म करने के लिए लाल बटन दबाएँ।"
                  : "आपका प्रिस्क्रिप्शन तैयार है। इसे दवा की दुकान पर दिखाएँ।"
            }
            englishPrompt={
              callStatus === 'connecting'
                ? doctor
                  ? `Connecting to ${doctor.name}, please wait.`
                  : "Connecting to the doctor, please wait."
                : callStatus === 'connected'
                  ? doctor
                    ? `${doctor.name} will talk to you. Press the red button to end the call.`
                    : "The doctor will talk to you. Press the red button to end the call."
                  : "Your prescription is ready. Show it at the pharmacy."
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorCall;
