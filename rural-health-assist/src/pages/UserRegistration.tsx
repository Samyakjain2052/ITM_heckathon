
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceGuidance from '@/components/VoiceGuidance';
import Header from '@/components/Header';
import TouchKeyboard from '@/components/TouchKeyboard';

const UserRegistration: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: ''
  });

  const [activeField, setActiveField] = useState<string | null>(null);
  const [keyboardType, setKeyboardType] = useState<'numeric' | 'alphanumeric' | 'hindi'>('alphanumeric');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const ageInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleVoiceInput = (fieldName: string) => {
    // In a real implementation, this would trigger speech recognition
    console.log(`Voice input for ${fieldName}`);
    
    // Mock implementation for demo
    alert(t(
      'माइक्रोफोन में बोलकर अपना नाम बताएं', 
      'Speak your name into the microphone'
    ));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.age || !formData.gender || !formData.mobile) {
      alert(t('कृपया सभी फ़ील्ड भरें', 'Please fill all fields'));
      return;
    }
    
    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      alert(t('कृपया सही मोबाइल नंबर दर्ज करें', 'Please enter a valid mobile number'));
      return;
    }
    
    // In a real app, you would submit this data to your backend
    // For this demo, we'll just navigate to the next screen
    navigate('/returning-user');
  };

  const handleFocus = (field: string, type: 'numeric' | 'alphanumeric' | 'hindi') => {
    setActiveField(field);
    setKeyboardType(type);
  };

  const handleBlur = () => {
    // We don't immediately set activeField to null to prevent the keyboard from disappearing
    // when the user taps a key (which would blur the input)
    setTimeout(() => {
      // Only blur if the active element is not an input
      if (document.activeElement?.tagName !== 'INPUT') {
        setActiveField(null);
      }
    }, 100);
  };

  const handleKeyPress = (value: string) => {
    if (!activeField) return;
    
    if (value === 'BACKSPACE') {
      // Handle backspace
      setFormData(prev => ({
        ...prev,
        [activeField]: prev[activeField as keyof typeof prev].slice(0, -1)
      }));
    } else {
      // Handle normal character input
      setFormData(prev => ({
        ...prev,
        [activeField]: prev[activeField as keyof typeof prev] + value
      }));
    }

    // Re-focus the input after typing
    if (activeField === 'name' && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (activeField === 'age' && ageInputRef.current) {
      ageInputRef.current.focus();
    } else if (activeField === 'mobile' && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-6 pb-40">
        <div className="w-full max-w-lg flex flex-col items-center gap-6">
          <h1 className="kiosk-large-text text-center font-hindi mb-4">
            {t('पंजीकरण फॉर्म', 'Registration Form')}
          </h1>
          
          <div className="w-full space-y-6">
            {/* Name field with voice input */}
            <div className="form-group">
              <label className="kiosk-medium-text block mb-2 font-hindi">
                {t('नाम', 'Name')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="name"
                  ref={nameInputRef}
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('name', language === 'hindi' ? 'hindi' : 'alphanumeric')}
                  onBlur={handleBlur}
                  className="kiosk-input flex-1"
                  placeholder={t('अपना नाम दर्ज करें', 'Enter your name')}
                />
                <button 
                  onClick={() => handleVoiceInput('name')}
                  className="p-3 bg-blue-100 rounded-xl hover:bg-blue-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Age field with number controls */}
            <div className="form-group">
              <label className="kiosk-medium-text block mb-2 font-hindi">
                {t('उम्र', 'Age')}
              </label>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const currentAge = parseInt(formData.age) || 0;
                    if (currentAge > 0) {
                      setFormData(prev => ({ ...prev, age: (currentAge - 1).toString() }));
                    }
                  }}
                  className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  disabled={!formData.age || parseInt(formData.age) <= 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                  </svg>
                </button>
                
                <input
                  type="number"
                  name="age"
                  ref={ageInputRef}
                  value={formData.age}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('age', 'numeric')}
                  onBlur={handleBlur}
                  className="kiosk-input flex-1 text-center"
                  placeholder="0"
                  min="0"
                  max="120"
                />
                
                <button 
                  onClick={() => {
                    const currentAge = parseInt(formData.age) || 0;
                    setFormData(prev => ({ ...prev, age: (currentAge + 1).toString() }));
                  }}
                  className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="M12 5v14"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Gender selection with icons */}
            <div className="form-group">
              <label className="kiosk-medium-text block mb-2 font-hindi">
                {t('लिंग', 'Gender')}
              </label>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => handleGenderSelect('male')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    formData.gender === 'male' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-4xl">👨</span>
                  <span className="font-hindi">{t('पुरुष', 'Male')}</span>
                </button>
                
                <button 
                  onClick={() => handleGenderSelect('female')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    formData.gender === 'female' 
                      ? 'bg-pink-100 border-2 border-pink-500' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-4xl">👩</span>
                  <span className="font-hindi">{t('महिला', 'Female')}</span>
                </button>
                
                <button 
                  onClick={() => handleGenderSelect('other')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    formData.gender === 'other' 
                      ? 'bg-purple-100 border-2 border-purple-500' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-4xl">⚧️</span>
                  <span className="font-hindi">{t('अन्य', 'Other')}</span>
                </button>
              </div>
            </div>
            
            {/* Mobile number field */}
            <div className="form-group">
              <label className="kiosk-medium-text block mb-2 font-hindi">
                {t('मोबाइल नंबर', 'Mobile Number')}
              </label>
              <input
                type="tel"
                name="mobile"
                ref={mobileInputRef}
                value={formData.mobile}
                onChange={handleInputChange}
                onFocus={() => handleFocus('mobile', 'numeric')}
                onBlur={handleBlur}
                className="kiosk-input w-full"
                placeholder={t('10 अंकों का मोबाइल नंबर', '10-digit mobile number')}
                maxLength={10}
              />
            </div>
          </div>
          
          <button 
            onClick={handleSubmit}
            className="kiosk-button-large kiosk-button-green mt-6"
          >
            <span className="font-hindi">{t('सबमिट करें', 'Submit')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
          
          <VoiceGuidance
            hindiPrompt="अपना नाम, उम्र और फोन नंबर डालें।"
            englishPrompt="Enter your name, age, and phone number."
          />
        </div>
      </div>

      {/* Touch Keyboard */}
      <TouchKeyboard 
        onKeyPress={handleKeyPress}
        type={keyboardType}
        showKeyboard={activeField !== null}
        onSubmit={() => setActiveField(null)}
      />
    </div>
  );
};

export default UserRegistration;
