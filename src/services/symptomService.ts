
import { toast } from "@/hooks/use-toast";

export type Symptom = 
  | 'fever' 
  | 'cold' 
  | 'headache' 
  | 'cough' 
  | 'soreThroat' 
  | 'stomachPain' 
  | 'rash' 
  | null;

export interface SymptomResponse {
  message: string;
  advice: string;
}

type SymptomHandler = (text: string) => SymptomResponse | null;

class SymptomService {
  private currentSymptom: Symptom = null;

  public getCurrentSymptom(): Symptom {
    return this.currentSymptom;
  }

  public setCurrentSymptom(symptom: Symptom) {
    this.currentSymptom = symptom;
  }

  public processMessage(text: string): { message: string, speak: boolean } {
    const lowerText = text.toLowerCase();
    
    if (this.currentSymptom) {
      // If we're already processing a symptom, provide a response
      const response = this.processSymptomFollowup(lowerText);
      this.currentSymptom = null;
      return { message: response, speak: true };
    }
    
    // Check for heart rate request
    if (lowerText.includes("heart") || lowerText.includes("pulse")) {
      return { message: "heart_rate_check", speak: false };
    }
    
    // Check for appointment request
    if (lowerText.includes("appointment") || lowerText.includes("book") || lowerText.includes("doctor")) {
      return { 
        message: "Would you like to book an appointment with a doctor? You can go to the Appointments tab to schedule one.", 
        speak: true 
      };
    }
    
    // Check for help request
    if (lowerText.includes("help") || lowerText.includes("what can you do")) {
      return { 
        message: "I can help with basic health information, checking symptoms like fever, cold, headache, cough, sore throat, stomach issues, skin rashes, monitoring your heart rate, and scheduling doctor appointments. What would you like assistance with?",
        speak: true 
      };
    }
    
    // Check for symptoms in the message
    if (lowerText.includes("fever") || lowerText.includes("high temperature")) {
      this.currentSymptom = "fever";
      return { 
        message: "I understand you might have a fever. Do you also have chills or body aches?",
        speak: true 
      };
    } 
    else if (lowerText.includes("cold") || lowerText.includes("runny nose") || lowerText.includes("sneezing")) {
      this.currentSymptom = "cold";
      return { 
        message: "It sounds like you might have a cold. Are you experiencing sneezing or congestion?",
        speak: true 
      };
    }
    else if (lowerText.includes("headache") || lowerText.includes("head pain") || lowerText.includes("migraine")) {
      this.currentSymptom = "headache";
      return { 
        message: "I understand you're experiencing headache symptoms. How long have you been having this pain? Is it constant or intermittent?",
        speak: true 
      };
    }
    else if (lowerText.includes("cough") || lowerText.includes("dry cough") || lowerText.includes("chest congestion")) {
      this.currentSymptom = "cough";
      return { 
        message: "You mentioned coughing. Is it a dry cough or are you coughing up mucus? How long have you been coughing?",
        speak: true 
      };
    }
    else if (lowerText.includes("sore throat") || lowerText.includes("throat pain")) {
      this.currentSymptom = "soreThroat";
      return { 
        message: "I see you have a sore throat. Do you also have difficulty swallowing? Any visible redness when you check your throat?",
        speak: true 
      };
    }
    else if (lowerText.includes("stomach") || lowerText.includes("nausea") || lowerText.includes("vomiting")) {
      this.currentSymptom = "stomachPain";
      return { 
        message: "I understand you're having stomach issues. Are you experiencing nausea, vomiting, or diarrhea along with the pain?",
        speak: true 
      };
    }
    else if (lowerText.includes("rash") || lowerText.includes("skin irritation") || lowerText.includes("itchy skin")) {
      this.currentSymptom = "rash";
      return { 
        message: "You mentioned a rash or skin irritation. Where on your body is the rash located? Is it itchy or painful?",
        speak: true 
      };
    }
    
    // Default response for unrecognized queries
    return { 
      message: "I'm not sure how to help with that specific issue. Could you try describing your symptoms or questions differently?", 
      speak: true 
    };
  }

  private processSymptomFollowup(text: string): string {
    switch (this.currentSymptom) {
      case "fever":
        return "Based on your symptoms, it could be a fever. I recommend taking Paracetamol (Tylenol) or Ibuprofen. Stay hydrated, rest, and monitor your temperature. If symptoms persist for more than 3 days or if you develop severe symptoms, please consult a doctor.";
      case "cold":
        return "You may have a common cold. Try taking antihistamines or decongestants. Drink warm fluids, rest, and use steam inhalation. If symptoms worsen or don't improve in a week, please see a healthcare provider.";
      case "headache":
        return "For your headache, you can try over-the-counter pain relievers like acetaminophen or ibuprofen. Rest in a quiet, dark room, apply a cold compress to your forehead, and stay hydrated. If headaches are severe, persistent, or accompanied by other symptoms like confusion or stiff neck, seek medical attention immediately.";
      case "cough":
        return "For your cough, stay hydrated and consider using honey (if you're not allergic and over 1 year old), cough drops, or over-the-counter cough medicine. For a dry cough, use a humidifier. If you're coughing up colored phlegm or have difficulty breathing, consult a healthcare provider.";
      case "soreThroat":
        return "For your sore throat, try gargling with salt water, drinking warm liquids, using throat lozenges, or taking over-the-counter pain relievers. If you have severe pain, difficulty swallowing, or the sore throat lasts more than a week, please see a doctor.";
      case "stomachPain":
        return "For stomach issues, try eating bland foods, staying hydrated, and avoiding spicy or fatty foods. Over-the-counter antacids may help with heartburn. If you experience severe pain, persistent vomiting, or notice blood in your stool, seek medical attention immediately.";
      case "rash":
        return "For your skin rash, avoid scratching and irritating the area. You can try applying cold compresses, using over-the-counter hydrocortisone cream, or taking an antihistamine for itching. If the rash spreads, blisters, or is accompanied by fever, consult a doctor promptly.";
      default:
        return "I'm not sure how to help with that specific issue. Could you try describing your symptoms or questions differently?";
    }
  }
}

export const symptomService = new SymptomService();
