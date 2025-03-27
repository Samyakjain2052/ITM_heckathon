import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiseaseSymptoms } from '../utils/api';
import { FaArrowRight, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface SymptomInputProps {
  // Props definitions here
}

const SymptomInput: React.FC<SymptomInputProps> = () => {
  const navigate = useNavigate();
  const [inputScreen, setInputScreen] = useState<'disease' | 'symptoms'>('disease');
  const [diseaseName, setDiseaseName] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [diseaseInfo, setDiseaseInfo] = useState<{
    disease: string;
    description: string;
    found: boolean;
  } | null>(null);

  // Handle disease name submission
  const handleDiseaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diseaseName.trim()) {
      toast.error('Please enter a disease name');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting disease name:', diseaseName);
      const response = await getDiseaseSymptoms(diseaseName);
      console.log('Received response:', response);

      // Check if the disease was found and has symptoms
      if (response && Array.isArray(response.symptoms) && response.symptoms.length > 0) {
        setDiseaseInfo({
          disease: response.disease || diseaseName,
          description: response.description || '',
          found: response.found || false
        });
        setSymptoms(response.symptoms);
        setInputScreen('symptoms');
      } else {
        // Handle case where no symptoms were found
        toast.warning(`No symptoms found for "${diseaseName}". Please try a different disease name.`);
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      toast.error('Failed to fetch symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle symptoms submission
  const handleSymptomsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }

    // Navigate to diagnosis page with selected symptoms
    navigate('/diagnosis', {
      state: {
        symptoms: selectedSymptoms,
        diseaseName: diseaseInfo?.disease || diseaseName
      }
    });
  };

  // Toggle symptom selection
  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  // Go back to disease input
  const handleBackToDiseaseInput = () => {
    setInputScreen('disease');
    setSelectedSymptoms([]);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {inputScreen === 'disease' ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Enter Disease Name
          </h2>
          <form onSubmit={handleDiseaseSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="diseaseName" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Disease Name:
              </label>
              <input
                type="text"
                id="diseaseName"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                placeholder="e.g., Diabetes, Flu, COVID-19"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  Next
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-blue-600">
              Select Symptoms for {diseaseInfo?.disease}
            </h2>
            {diseaseInfo?.description && (
              <p className="mt-2 text-gray-600">{diseaseInfo.description}</p>
            )}
            {!diseaseInfo?.found && (
              <p className="mt-2 text-yellow-600 text-sm">
                Note: This disease may not be in our database. These are general symptoms.
              </p>
            )}
          </div>
          
          <form onSubmit={handleSymptomsSubmit} className="space-y-4">
            <div className="border border-gray-200 rounded-md p-4 max-h-60 overflow-y-auto">
              {symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`symptom-${index}`}
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`symptom-${index}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {symptom}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleBackToDiseaseInput}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Get Diagnosis
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SymptomInput; 