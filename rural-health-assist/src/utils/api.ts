const API_BASE_URL = 'http://localhost:8080';

export interface PredictionResponse {
  predictedDisease: string;
  confidence: number;
  matchingSymptoms?: string[];
  description: string;
  message: string;
}

export interface DiseaseInfo {
  disease: string;
  symptoms: string[];
  description: string;
  found: boolean;
  note?: string;
}

export const predictDiseaseFromSymptoms = async (symptoms: string[]): Promise<PredictionResponse> => {
  try {
    console.log('Sending symptoms to API:', symptoms); // Debug log
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    const data = await response.json();
    console.log('Received response from API:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to get prediction');
    }

    // Ensure all required fields are present
    return {
      predictedDisease: data.predictedDisease || "Unknown",
      confidence: data.confidence || 0,
      matchingSymptoms: data.matchingSymptoms || [],
      description: data.description || "",
      message: data.message || ""
    };
  } catch (error) {
    console.error('Error predicting disease:', error);
    return {
      predictedDisease: "Error",
      confidence: 0,
      description: "",
      message: error instanceof Error ? error.message : 'An error occurred while getting the prediction'
    };
  }
};

export const getDiseaseSymptoms = async (diseaseName: string): Promise<DiseaseInfo> => {
  try {
    // Clean up disease name and properly encode it for URL
    const cleanedDiseaseName = diseaseName.trim();
    console.log('Fetching symptoms for disease:', cleanedDiseaseName); // Debug log
    
    // Use proper encoding for URL parameters
    const encodedName = encodeURIComponent(cleanedDiseaseName);
    const url = `${API_BASE_URL}/symptoms/${encodedName}`;
    console.log('Request URL:', url); // Debug log
    
    const response = await fetch(url);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Received non-JSON response:', await response.text());
      throw new Error('Server returned non-JSON response');
    }
    
    const data = await response.json();
    console.log('Received disease symptoms:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to get disease symptoms');
    }

    // Ensure all required fields are present with proper defaults
    return {
      disease: data.disease || cleanedDiseaseName,
      symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
      description: data.description || "",
      found: data.found === true, // Ensure boolean conversion
      note: data.note
    };
  } catch (error) {
    console.error('Error getting disease symptoms:', error);
    return {
      disease: diseaseName,
      symptoms: [],
      description: error instanceof Error ? error.message : 'Failed to get disease symptoms',
      found: false
    };
  }
}; 