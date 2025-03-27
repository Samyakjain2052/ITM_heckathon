import { predictDiseaseFromSymptoms as apiPredictDisease, getDiseaseSymptoms as apiGetDiseaseSymptoms } from './api';

// This is a JavaScript implementation of the Python ML model provided
// In a production app, this would be an API call to a backend service

export interface DiseaseInfo {
  disease: string;
  symptoms: string[];
  description: string;
  found: boolean;
  note?: string;
}

export interface Prediction {
  predictedDisease: string;
  confidence: number;
  matchingSymptoms?: string[];
  description: string;
  message: string;
}

// Medical knowledge base
const medicalKnowledge = {
  "Flu": {
    symptoms: [
      "High fever", "Body aches", "Fatigue", 
      "Respiratory symptoms", "Headache"
    ],
    description: "A contagious respiratory illness caused by influenza viruses."
  },
  "COVID-19": {
    symptoms: [
      "Fever", "Dry cough", "Tiredness", 
      "Loss of taste or smell", "Shortness of breath"
    ],
    description: "A highly infectious respiratory disease caused by the SARS-CoV-2 virus."
  },
  "Pneumonia": {
    symptoms: [
      "Chest pain", "Difficulty breathing", 
      "Persistent cough", "Fever", "Chills"
    ],
    description: "An infection that inflames the air sacs in one or both lungs."
  },
  "Diabetes": {
    symptoms: [
      "Increased thirst", "Frequent urination", 
      "Extreme hunger", "Unexplained weight loss", "Fatigue"
    ],
    description: "A chronic condition affecting how your body turns food into energy."
  },
  "Migraine": {
    symptoms: [
      "Severe headache", "Sensitivity to light", 
      "Nausea", "Vomiting", "Visual disturbances"
    ],
    description: "A neurological condition causing intense, debilitating headaches."
  },
  "Hypertension": {
    symptoms: [
      "Headaches", "Shortness of breath", 
      "Nosebleeds", "Flushing", "Dizziness"
    ],
    description: "A condition where blood pressure against artery walls is consistently too high."
  },
  "Asthma": {
    symptoms: [
      "Shortness of breath", "Chest tightness", 
      "Wheezing", "Coughing", "Difficulty breathing during physical activity"
    ],
    description: "A condition affecting airways in the lungs, causing breathing difficulties."
  }
};

// Extract all unique symptoms
const getAllSymptoms = (): string[] => {
  const allSymptoms: string[] = [];
  
  Object.values(medicalKnowledge).forEach(details => {
    details.symptoms.forEach(symptom => {
      if (!allSymptoms.includes(symptom)) {
        allSymptoms.push(symptom);
      }
    });
  });
  
  return allSymptoms;
};

export const getDiseaseSymptoms = async (diseaseName: string): Promise<DiseaseInfo> => {
  try {
    return await apiGetDiseaseSymptoms(diseaseName);
  } catch (error) {
    console.error("Error getting disease symptoms:", error);
    return {
      disease: diseaseName,
      symptoms: ["Pain", "Discomfort", "Changes in normal function", "Inflammation", "General unwellness"],
      description: "Information based on general medical patterns",
      found: false
    };
  }
};

export const predictDiseaseFromSymptoms = async (selectedSymptoms: string[]): Promise<Prediction> => {
  try {
    if (!selectedSymptoms || selectedSymptoms.length === 0) {
      return {
        predictedDisease: "Unknown",
        confidence: 0,
        description: "",
        message: "Not enough symptoms to make a prediction."
      };
    }

    return await apiPredictDisease(selectedSymptoms);
  } catch (error) {
    console.error("Error predicting disease:", error);
    return {
      predictedDisease: "Error",
      confidence: 0,
      description: "",
      message: "An error occurred while processing your symptoms."
    };
  }
};

export const getAllCommonSymptoms = (): string[] => {
  return [
    "Fever", "Cough", "Headache", "Fatigue", "Body aches",
    "Shortness of breath", "Chest pain", "Nausea", "Vomiting",
    "Diarrhea", "Sore throat", "Runny nose", "Sneezing",
    "Muscle pain", "Joint pain"
  ];
};
