import re
import os
import random
import time
class MedicalAssistant:
    def __init__(self):
        """Initialize medical assistant with knowledge base"""
        # Comprehensive medical knowledge base
        self.medical_knowledge = {
            "Flu": {
                "symptoms": [
                    "High fever", "Body aches", "Fatigue", 
                    "Respiratory symptoms", "Headache"
                ],
                "description": "A contagious respiratory illness caused by influenza viruses."
            },
            "COVID-19": {
                "symptoms": [
                    "Fever", "Dry cough", "Tiredness", 
                    "Loss of taste or smell", "Shortness of breath"
                ],
                "description": "A highly infectious respiratory disease caused by the SARS-CoV-2 virus."
            },
            "Pneumonia": {
                "symptoms": [
                    "Chest pain", "Difficulty breathing", 
                    "Persistent cough", "Fever", "Chills"
                ],
                "description": "An infection that inflames the air sacs in one or both lungs."
            },
            "Diabetes": {
                "symptoms": [
                    "Increased thirst", "Frequent urination", 
                    "Extreme hunger", "Unexplained weight loss", "Fatigue"
                ],
                "description": "A chronic condition affecting how your body turns food into energy."
            },
            "Migraine": {
                "symptoms": [
                    "Severe headache", "Sensitivity to light", 
                    "Nausea", "Vomiting", "Visual disturbances"
                ],
                "description": "A neurological condition causing intense, debilitating headaches."
            },
            "Hypertension": {
                "symptoms": [
                    "Headaches", "Shortness of breath", 
                    "Nosebleeds", "Flushing", "Dizziness"
                ],
                "description": "A condition where blood pressure against artery walls is consistently too high."
            },
            "Asthma": {
                "symptoms": [
                    "Shortness of breath", "Chest tightness", 
                    "Wheezing", "Coughing", "Difficulty breathing during physical activity"
                ],
                "description": "A condition affecting airways in the lungs, causing breathing difficulties."
            }
        }
        
        # All unique symptoms for symptom-based diagnosis
        self.all_symptoms = []
        for disease, details in self.medical_knowledge.items():
            for symptom in details["symptoms"]:
                if symptom not in self.all_symptoms:
                    self.all_symptoms.append(symptom)

    def get_disease_symptoms(self, disease_name):
        """Get symptoms for a specific disease"""
        try:
            # Clean up disease name for case-insensitive matching
            disease_name = disease_name.strip()
            disease_name_lower = disease_name.lower()
            
            # Try to find the disease in our knowledge base (case-insensitive)
            for disease, details in self.medical_knowledge.items():
                if disease.lower() == disease_name_lower:
                    return {
                        "disease": disease,
                        "symptoms": details["symptoms"],
                        "description": details["description"],
                        "found": True
                    }
                    
            # Try partial matching as fallback
            for disease, details in self.medical_knowledge.items():
                if disease_name_lower in disease.lower() or disease.lower() in disease_name_lower:
                    return {
                        "disease": disease,
                        "symptoms": details["symptoms"],
                        "description": details["description"],
                        "found": True,
                        "note": "Partial match found"
                    }
            
            # Rule-based approach for common disease patterns
            if "flu" in disease_name_lower or "influenza" in disease_name_lower:
                return {
                    "disease": disease_name,
                    "symptoms": ["Fever", "Body aches", "Fatigue", "Cough", "Headache"],
                    "description": "A viral respiratory infection with flu-like symptoms.",
                    "found": False
                }
                
            # Ultimate fallback - generalized symptoms
            return {
                "disease": disease_name,
                "symptoms": [
                    "Pain or discomfort", 
                    "Changes in normal function", 
                    "Inflammation or swelling", 
                    "Fatigue or weakness",
                    "General feeling of unwellness"
                ],
                "description": "A medical condition with generalized symptoms.",
                "found": False
            }
            
        except Exception as e:
            print(f"Error getting disease symptoms: {e}")
            return {
                "disease": disease_name,
                "symptoms": ["Pain", "Discomfort", "Changes in normal function", "Inflammation", "General unwellness"],
                "description": "Information based on general medical patterns",
                "found": False
            }
            
    def predict_disease_from_symptoms(self, selected_symptoms):
        """Predict disease based on selected symptoms"""
        try:
            if not selected_symptoms:
                return {
                    "predicted_disease": "Unknown",
                    "confidence": 0,
                    "message": "Not enough symptoms to make a prediction."
                }
            
            # Calculate match score for each disease
            disease_scores = {}
            for disease, details in self.medical_knowledge.items():
                # Count matching symptoms
                matching_symptoms = [s for s in selected_symptoms if any(
                    s.lower() in known.lower() or known.lower() in s.lower() 
                    for known in details["symptoms"]
                )]
                
                if matching_symptoms:
                    # Calculate score based on symptom matches and coverage
                    match_score = len(matching_symptoms) / len(details["symptoms"])
                    coverage = len(matching_symptoms) / len(selected_symptoms)
                    total_score = (match_score + coverage) / 2
                    
                    disease_scores[disease] = {
                        "score": total_score,
                        "matching": matching_symptoms,
                        "description": details["description"]
                    }
            
            # Sort diseases by score
            sorted_diseases = sorted(
                disease_scores.items(), 
                key=lambda x: x[1]["score"], 
                reverse=True
            )
            
            if not sorted_diseases:
                return {
                    "predicted_disease": "Unknown",
                    "confidence": 0,
                    "message": "Could not find a matching condition. Please consult a healthcare professional."
                }
            
            # Get top disease
            top_disease, details = sorted_diseases[0]
            confidence = int(details["score"] * 100)
            
            # Format message
            message = f"Based on your symptoms, you may have {top_disease}.\n"
            message += f"Confidence: {confidence}%\n"
            message += f"Matching symptoms: {', '.join(details['matching'])}\n"
            message += f"\nDescription: {details['description']}\n"
            message += "\nNote: This is not a medical diagnosis. Please consult with a healthcare professional."
            
            # Return prediction
            return {
                "predicted_disease": top_disease,
                "confidence": confidence,
                "matching_symptoms": details["matching"],
                "description": details["description"],
                "message": message
            }
            
        except Exception as e:
            print(f"Error predicting disease: {e}")
            return {
                "predicted_disease": "Error",
                "confidence": 0,
                "message": "An error occurred while processing your symptoms."
            }

def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')

def simulate_loading(message="Processing", duration=1.5):
    """Show a simple loading animation"""
    for _ in range(3):
        for char in [".  ", ".. ", "..."]:
            print(f"\r{message}{char}", end="", flush=True)
            time.sleep(duration/3)
    print()

def print_header(title):
    """Print a formatted header"""
    clear_screen()
    width = 60
    print("="*width)
    print(f"{title:^{width}}")
    print("="*width)
    print()

def print_footer():
    """Print a formatted footer"""
    width = 60
    print("\n" + "-"*width)
    print("Disclaimer: This is not medical advice. Please consult a healthcare professional.")
    print("-"*width + "\n")

def display_checkbox_menu(options, title="Make a selection"):
    """Display a checkbox-style menu and get user selections"""
    print_header(title)
    
    for i, option in enumerate(options, 1):
        print(f"[{i:2}] {option}")
    print()
    print(f"[{len(options)+1:2}] None of the above")
    print(f"[ 0] Submit selections")
    print()
    
    selected = []
    
    while True:
        try:
            choice = input("Enter a number to toggle selection (0 to finish): ")
            
            if not choice.strip():
                continue
                
            choice = int(choice.strip())
            
            if choice == 0:
                # Submit
                return selected, choice == len(options)+1
            elif choice == len(options)+1:
                # None of the above - return empty list with special flag
                return [], True
            elif 1 <= choice <= len(options):
                # Toggle selection
                option = options[choice-1]
                if option in selected:
                    selected.remove(option)
                    print(f"Removed: {option}")
                else:
                    selected.append(option)
                    print(f"Added: {option}")
                    
                # Show current selections
                if selected:
                    print("\nCurrent selections:")
                    for i, item in enumerate(selected, 1):
                        print(f"  {i}. {item}")
                else:
                    print("\nNo symptoms selected")
            else:
                print("Invalid option. Try again.")
        except ValueError:
            print("Please enter a number.")
        except Exception as e:
            print(f"Error: {e}")

def symptom_input_mode():
    """Let user input their symptoms directly"""
    print_header("SYMPTOM INPUT")
    
    print("Please enter the symptoms you're experiencing.")
    print("Enter one symptom per line. Type 'done' when finished.\n")
    
    symptoms = []
    while True:
        symptom = input("> ").strip()
        if symptom.lower() == 'done':
            break
        if symptom and len(symptom) > 2:
            symptoms.append(symptom)
            print(f"Added: {symptom}")
    
    return symptoms

def main():
    """Main entry point of the program"""
    medical_assistant = MedicalAssistant()
    
    print_header("MEDICAL SYMPTOM CHECKER")
    print("This system can help identify possible medical conditions.")
    print("Note: This is not a substitute for professional medical advice.")
    print("\nPress Enter to begin...")
    input()
    
    while True:
        clear_screen()
        print_header("DISEASE INQUIRY")
        
        # Step 1: Ask for disease name
        disease_name = input("Enter a disease name (or type 'exit' to quit): ")
        
        if disease_name.lower() == 'exit':
            print("\nThank you for using the Medical Symptom Checker. Goodbye!")
            break
            
        if not disease_name.strip():
            print("Please enter a valid disease name.")
            input("\nPress Enter to continue...")
            continue
        
        # Get symptoms for the disease
        simulate_loading(f"Looking up information for {disease_name}")
        disease_info = medical_assistant.get_disease_symptoms(disease_name)
        
        # Display disease information
        print_header(f"INFORMATION ABOUT {disease_info['disease'].upper()}")
        
        if disease_info["found"]:
            print(f"Source: Medical Knowledge Database")
        else:
            print(f"Source: Generated from Medical Patterns")
            
        print(f"\nDescription: {disease_info['description']}")
        
        print("\nCommon symptoms:")
        for i, symptom in enumerate(disease_info["symptoms"], 1):
            print(f"  {i}. {symptom}")
            
        print("\nPlease check if you have any of these symptoms:")
        
        # Display symptom checkboxes
        selected_symptoms, none_selected = display_checkbox_menu(
            disease_info["symptoms"],
            f"SELECT SYMPTOMS OF {disease_info['disease'].upper()}"
        )
        
        if none_selected:
            # User selected "None of the above"
            print_header("SYMPTOM-BASED DIAGNOSIS")
            print("You indicated you don't have the typical symptoms.")
            print("Let's try to identify your condition based on symptoms you do have.")
            input("\nPress Enter to continue...")
            
            # Show a selection of common symptoms
            common_symptoms = medical_assistant.all_symptoms
            random.shuffle(common_symptoms)  # Randomize to get different symptoms each time
            
            # First show a selection of common symptoms
            print_header("SELECT YOUR SYMPTOMS")
            print("Please select any symptoms you're experiencing:\n")
            
            selected_common, none_again = display_checkbox_menu(
                common_symptoms[:15],  # Show only first 15 to avoid overwhelm
                "COMMON SYMPTOMS"
            )
            
            user_symptoms = selected_common
            
            # If still none selected, let user type their symptoms
            if none_again or not selected_common:
                print_header("CUSTOM SYMPTOM INPUT")
                print("Please type in the symptoms you're experiencing.\n")
                custom_symptoms = symptom_input_mode()
                user_symptoms.extend(custom_symptoms)
            
            # Predict disease based on symptoms
            if user_symptoms:
                simulate_loading("Analyzing your symptoms")
                
                prediction = medical_assistant.predict_disease_from_symptoms(user_symptoms)
                
                print_header("DIAGNOSIS RESULTS")
                print(f"Based on your symptoms, you may have: {prediction['predicted_disease']}")
                print(f"Confidence: {prediction['confidence']}%")
                
                if prediction['confidence'] > 0:
                    print("\nMatching symptoms:")
                    for symptom in prediction.get("matching_symptoms", []):
                        print(f"  • {symptom}")
                    
                    print(f"\nDescription: {prediction.get('description', '')}")
                
                print("\nIMPORTANT: This is not a medical diagnosis.")
                print("Please consult a healthcare professional.")
            else:
                print_header("DIAGNOSIS RESULTS")
                print("Not enough symptom information provided to make a prediction.")
                print("Please consult a healthcare professional for proper diagnosis.")
        else:
            # User selected some symptoms from the list
            print_header("CONFIRMATION")
            
            if selected_symptoms:
                print(f"You have selected these symptoms of {disease_info['disease']}:")
                for symptom in selected_symptoms:
                    print(f"  • {symptom}")
                
                print(f"\nBased on your selections, you may be experiencing {disease_info['disease']}.")
                print(f"\nDescription: {disease_info['description']}")
                print("\nIMPORTANT: This is not a medical diagnosis.")
                print("Please consult a healthcare professional.")
            else:
                print("You didn't select any symptoms.")
                print("Please consult a healthcare professional for proper diagnosis.")
        
        # Footer
        print_footer()
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nProgram terminated by user.")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")
        print("The program will now exit.")