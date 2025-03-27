import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceGuidance from '@/components/VoiceGuidance';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { predictDiseaseFromSymptoms } from '@/utils/api';
import { getDoctorsForDisease, type Doctor } from '@/utils/doctorUtils';
import DoctorCard from '@/components/DoctorCard';
import { FaSpinner } from 'react-icons/fa';

interface LocationState {
  symptoms: string[];
  diseaseName: string;
}

const Diagnosis: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state
  const state = location.state as LocationState;
  const symptoms = state?.symptoms || [];
  const diseaseName = state?.diseaseName || '';
  
  const [prediction, setPrediction] = useState<{
    predictedDisease: string;
    confidence: number;
    description: string;
    message: string;
    matchingSymptoms?: string[];
  } | null>(null);
  
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the ML model to predict the disease based on symptoms
  useEffect(() => {
    if (!state || !state.symptoms || state.symptoms.length === 0) {
      setIsLoading(false);
      setError(t('लक्षण नहीं प्रदान किए गए', 'No symptoms provided. Please go back and select symptoms.'));
      return;
    }

    const fetchPrediction = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching prediction for symptoms:', symptoms);
        
        const predictionResult = await predictDiseaseFromSymptoms(symptoms);
        console.log('Received prediction:', predictionResult);
        
        if (predictionResult.predictedDisease === "Error") {
          throw new Error(predictionResult.message);
        }

        // Format the prediction result
        const result = {
          predictedDisease: t(predictionResult.predictedDisease, predictionResult.predictedDisease),
          confidence: predictionResult.confidence,
          description: t(predictionResult.description, predictionResult.description),
          matchingSymptoms: predictionResult.matchingSymptoms,
          message: predictionResult.message
        };
        
        setPrediction(result);
        
        // Get available doctors for the predicted disease
        const doctors = await getDoctorsForDisease(result.predictedDisease);
        setAvailableDoctors(doctors);
      } catch (err) {
        console.error('Error in fetchPrediction:', err);
        setError(err instanceof Error ? err.message : t('निदान प्राप्त करने में विफल', 'Failed to get diagnosis. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [symptoms, t, state]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };
  
  const handleCallDoctor = () => {
    if (selectedDoctor) {
      navigate('/doctor-call', { 
        state: { 
          doctor: selectedDoctor,
          disease: prediction?.predictedDisease,
          symptoms 
        } 
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <VoiceGuidance pageName="diagnosis" />
      
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">
          {t('निदान परिणाम', 'Diagnosis Results')}
        </h1>
        <Button variant="outline" onClick={goBack}>
          {t('वापस जाएं', 'Go Back')}
        </Button>
      </div>
          
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-primary h-12 w-12" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>{t('त्रुटि', 'Error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : prediction && (
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('आपका निदान', 'Your Diagnosis')}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {prediction.predictedDisease}
                </p>
              </div>
              <div className="rounded-lg bg-muted px-3 py-1 text-sm flex flex-col items-center">
                <span className="text-muted-foreground">
                  {t('विश्वास स्तर', 'Confidence')}
                </span>
                <span className="font-medium">{prediction.confidence}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  {t('विवरण', 'Description')}
                </h3>
                <p className="text-muted-foreground">
                  {prediction.description}
                </p>
              </div>
              
              {prediction.matchingSymptoms && prediction.matchingSymptoms.length > 0 && (
                <div>
                  <h3 className="font-semibold">
                    {t('मिलान लक्षण', 'Matching Symptoms')}
                  </h3>
                  <ul className="list-disc pl-5">
                    {prediction.matchingSymptoms.map((symptom, index) => (
                      <li key={index} className="text-muted-foreground">
                        {t(symptom, symptom)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-yellow-800 text-sm">
                  {t('यह एक चिकित्सीय निदान नहीं है। कृपया स्वास्थ्य पेशेवर से परामर्श करें।', 
                    'This is not a medical diagnosis. Please consult with a healthcare professional.')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">
                  {t('उपलब्ध डॉक्टर', 'Available Doctors')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onSelect={handleDoctorSelect}
                      isSelected={selectedDoctor?.id === doctor.id}
                    />
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={handleCallDoctor}
                    className="bg-green-500 hover:bg-green-600"
                    size="lg"
                    disabled={!selectedDoctor}
                  >
                    {t('डॉक्टर से कॉल करें', 'Call Doctor')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Diagnosis;
