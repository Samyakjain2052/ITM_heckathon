from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from app import MedicalAssistant

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the medical assistant
print("Initializing Medical Assistant (will download model on first run)...")
medical_assistant = MedicalAssistant()
print("Medical Assistant initialized!")

class SymptomsRequest(BaseModel):
    symptoms: List[str]

@app.post("/predict")
async def predict_disease(request: SymptomsRequest):
    try:
        prediction = medical_assistant.predict_disease_from_symptoms(request.symptoms)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/symptoms/{disease}")
async def get_disease_symptoms(disease: str):
    try:
        # Log the request for debugging
        print(f"Received request for disease: {disease}")
        
        # Get symptoms from the medical assistant
        disease_info = medical_assistant.get_disease_symptoms(disease)
        print(f"Retrieved disease info: {disease_info}")
        
        # Ensure response format matches what the frontend expects
        # The frontend expects: disease, symptoms, description, found, and optional note
        response = {
            "disease": disease_info.get("disease", disease),
            "symptoms": disease_info.get("symptoms", []),
            "description": disease_info.get("description", ""),
            "found": disease_info.get("found", False)
        }
        
        # Add note if present
        if "note" in disease_info:
            response["note"] = disease_info["note"]
            
        # Add source if present (but not required by frontend)
        if "source" in disease_info:
            response["source"] = disease_info["source"]
            
        print(f"Sending response: {response}")
        return response
    except Exception as e:
        print(f"Error in get_disease_symptoms: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080) 