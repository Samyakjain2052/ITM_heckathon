import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceGuidance from '@/components/VoiceGuidance';
import Header from '@/components/Header';
import TouchKeyboard from '@/components/TouchKeyboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getDiseaseSymptoms } from '@/utils/api';

interface Symptom {
  id: string;
  description: string;
}

const SymptomInput: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [currentScreen, setCurrentScreen] = useState<'diseaseInput' | 'symptomSelection'>('diseaseInput');
  const [diseaseInput, setDiseaseInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [keyboardType, setKeyboardType] = useState<'numeric' | 'alphanumeric' | 'hindi'>('alphanumeric');

  const handleDiseaseSubmit = async () => {
    if (diseaseInput.trim() === '') {
      setError(t('कृपया बीमारी का नाम दर्ज करें', 'Please enter a disease name'));
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching symptoms for disease:', diseaseInput);
      
      // Get disease symptoms from backend
      const diseaseInfo = await getDiseaseSymptoms(diseaseInput);
      console.log('Received disease info:', diseaseInfo);
      
      if (!diseaseInfo || !diseaseInfo.symptoms || diseaseInfo.symptoms.length === 0) {
        setError(t('बीमारी के लक्षण प्राप्त करने में त्रुटि हुई', 'Failed to get symptoms for the disease'));
        setIsLoading(false);
        return;
      }
      
      // Convert symptoms to format needed for UI
      const symptomsList = diseaseInfo.symptoms.map(symptom => ({
        id: symptom.toLowerCase().replace(/\s+/g, '-'),
        description: symptom
      }));
      
      setSymptoms(symptomsList);
      setCurrentScreen('symptomSelection');
    } catch (err) {
      console.error('Error fetching disease symptoms:', err);
      setError(t('बीमारी के लक्षण प्राप्त करने में त्रुटि हुई', 'Failed to get symptoms for the disease'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomToggle = (symptomDescription: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomDescription)) {
        return prev.filter(s => s !== symptomDescription);
      } else {
        return [...prev, symptomDescription];
      }
    });
  };

  const handleSubmit = () => {
    // Check if any symptoms are selected or custom symptom is entered
    if (selectedSymptoms.length === 0 && customSymptom.trim() === '') {
      setError(t('कृपया लक्षण चुनें या दर्ज करें', 'Please select or enter symptoms'));
      return;
    }

    // Combine selected symptoms and custom symptom if entered
    const allSymptoms = [...selectedSymptoms];
    if (customSymptom.trim() !== '') {
      allSymptoms.push(customSymptom.trim());
    }

    // Navigate to diagnosis page with symptoms
    navigate('/diagnosis', {
      state: {
        symptoms: allSymptoms,
        diseaseName: diseaseInput
      }
    });
  };

  const handleKeyPress = (key: string) => {
    if (activeField === 'diseaseInput') {
      setDiseaseInput(prev => prev + key);
    } else if (activeField === 'customSymptom') {
      setCustomSymptom(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    if (activeField === 'diseaseInput') {
      setDiseaseInput(prev => prev.slice(0, -1));
    } else if (activeField === 'customSymptom') {
      setCustomSymptom(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <VoiceGuidance />

      {currentScreen === 'diseaseInput' ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {t('अपने लक्षण बताएँ', 'Tell us your symptoms')}
            </CardTitle>
            <p className="text-center text-muted-foreground">
              {t('सभी लागू लक्षणों का चयन करें या बीमारी का नाम बताएँ', 'Select all symptoms that apply or enter disease name')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-center mb-4">
                  {t('बीमारी का नाम दर्ज करें', 'Enter Disease Name')}
                </h2>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={t('जैसे: बुखार, सर्दी, आदि', 'Ex: Fever, Cold, etc.')}
                    value={diseaseInput}
                    onChange={(e) => setDiseaseInput(e.target.value)}
                    onFocus={() => setActiveField('diseaseInput')}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleDiseaseSubmit} 
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isLoading ? t('खोज रहे हैं...', 'Searching...') : t('खोजें', 'Find')}
                  </Button>
                </div>
                {error && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              {activeField === 'diseaseInput' && (
                <TouchKeyboard
                  onKeyPress={handleKeyPress}
                  onBackspace={handleBackspace}
                  keyboardType={keyboardType}
                  onChangeKeyboardType={setKeyboardType}
                />
              )}

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="mr-2"
                >
                  {t('वापस', 'Back')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {t('लक्षणों का चयन करें', 'Select Symptoms')}
            </CardTitle>
            <p className="text-center text-muted-foreground">
              {t(`${diseaseInput} के लिए लक्षणों का चयन करें`, `Select symptoms for ${diseaseInput}`)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Symptom checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {symptoms.map((symptom) => (
                  <div className="flex items-center space-x-2" key={symptom.id}>
                    <Checkbox 
                      id={symptom.id} 
                      checked={selectedSymptoms.includes(symptom.description)}
                      onCheckedChange={() => handleSymptomToggle(symptom.description)}
                    />
                    <Label htmlFor={symptom.id}>{symptom.description}</Label>
                  </div>
                ))}
              </div>

              {/* Custom symptom input */}
              <div className="space-y-2">
                <Label htmlFor="customSymptom">
                  {t('अपने अन्य लक्षण यहाँ लिखें', 'Write your other symptoms here')}
                </Label>
                <Textarea
                  id="customSymptom"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onFocus={() => setActiveField('customSymptom')}
                  placeholder={t('अन्य लक्षण...', 'Other symptoms...')}
                  className="min-h-[80px]"
                />
              </div>

              {activeField === 'customSymptom' && (
                <TouchKeyboard
                  onKeyPress={handleKeyPress}
                  onBackspace={handleBackspace}
                  keyboardType={keyboardType}
                  onChangeKeyboardType={setKeyboardType}
                />
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center space-x-4 mt-6">
                <Button
                  onClick={() => setCurrentScreen('diseaseInput')}
                  variant="outline"
                  className="min-w-[100px]"
                >
                  {t('वापस', 'Back')}
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600 min-w-[100px]"
                >
                  {t('आगे बढ़ें', 'Next')} →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SymptomInput;
