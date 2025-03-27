
// This is a simulated doctor data service
// In a production app, this would fetch data from a backend API

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  languages: string[];
  availability: 'available' | 'busy' | 'offline';
  avatarUrl?: string;
  rating: number;
}

// Map of specialties to related diseases
const specialtyDiseaseMap: Record<string, string[]> = {
  "General Physician": ["Flu", "COVID-19", "Fever", "Common Cold"],
  "Pulmonologist": ["Pneumonia", "Asthma", "COVID-19", "Bronchitis"],
  "Neurologist": ["Migraine", "Epilepsy", "Stroke"],
  "Cardiologist": ["Hypertension", "Heart Disease", "Chest Pain"],
  "Endocrinologist": ["Diabetes", "Thyroid Disorders"],
  "Dermatologist": ["Eczema", "Psoriasis", "Skin Rash"],
  "Gastroenterologist": ["Stomach Pain", "IBS", "Acid Reflux"],
  "Pediatrician": ["Childhood Diseases", "Growth Issues"],
  "Orthopedic": ["Joint Pain", "Fractures", "Arthritis"]
};

// Sample doctor data
const doctorsDatabase: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    experience: 8,
    languages: ["Hindi", "English"],
    availability: "available",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8
  },
  {
    id: "doc2",
    name: "Dr. Rajesh Kumar",
    specialty: "Pulmonologist",
    experience: 12,
    languages: ["Hindi", "English", "Punjabi"],
    availability: "available",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.9
  },
  {
    id: "doc3",
    name: "Dr. Anjali Desai",
    specialty: "Neurologist",
    experience: 10,
    languages: ["Hindi", "English", "Gujarati"],
    availability: "busy",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4.7
  },
  {
    id: "doc4",
    name: "Dr. Vikram Patel",
    specialty: "Cardiologist",
    experience: 15,
    languages: ["Hindi", "English"],
    availability: "available",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4.9
  },
  {
    id: "doc5",
    name: "Dr. Meera Reddy",
    specialty: "Endocrinologist",
    experience: 9,
    languages: ["Hindi", "English", "Telugu"],
    availability: "available",
    avatarUrl: "https://randomuser.me/api/portraits/women/25.jpg",
    rating: 4.6
  },
  {
    id: "doc6",
    name: "Dr. Sanjay Gupta",
    specialty: "Dermatologist",
    experience: 7,
    languages: ["Hindi", "English", "Bengali"],
    availability: "offline",
    avatarUrl: "https://randomuser.me/api/portraits/men/59.jpg",
    rating: 4.5
  },
  {
    id: "doc7",
    name: "Dr. Neha Singh",
    specialty: "Gastroenterologist",
    experience: 11,
    languages: ["Hindi", "English"],
    availability: "available",
    avatarUrl: "https://randomuser.me/api/portraits/women/17.jpg",
    rating: 4.8
  },
  {
    id: "doc8",
    name: "Dr. Amit Joshi",
    specialty: "General Physician",
    experience: 6,
    languages: ["Hindi", "English", "Marathi"],
    availability: "available",
    avatarUrl: "https://randomuser.me/api/portraits/men/86.jpg",
    rating: 4.4
  }
];

/**
 * Get doctors relevant for a specific disease
 */
export const getDoctorsForDisease = (disease: string): Doctor[] => {
  // Find relevant specialties for the disease
  const relevantSpecialties: string[] = [];
  
  // Normalize the disease name for case-insensitive matching
  const normalizedDisease = disease.toLowerCase();
  
  // Find matching specialties
  Object.entries(specialtyDiseaseMap).forEach(([specialty, diseases]) => {
    const hasMatchingDisease = diseases.some(d => 
      normalizedDisease.includes(d.toLowerCase()) || 
      d.toLowerCase().includes(normalizedDisease)
    );
    
    if (hasMatchingDisease) {
      relevantSpecialties.push(specialty);
    }
  });
  
  // If no specific specialty matched, include general physicians
  if (relevantSpecialties.length === 0) {
    relevantSpecialties.push("General Physician");
  }
  
  // Filter doctors by the relevant specialties and availability
  const relevantDoctors = doctorsDatabase.filter(doctor => 
    relevantSpecialties.includes(doctor.specialty) && 
    doctor.availability !== "offline"
  );
  
  // Sort by availability first (available before busy) and then by rating
  return relevantDoctors.sort((a, b) => {
    if (a.availability === "available" && b.availability !== "available") return -1;
    if (a.availability !== "available" && b.availability === "available") return 1;
    return b.rating - a.rating;
  }).slice(0, 3); // Return top 3 doctors
};

