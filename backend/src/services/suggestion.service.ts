//File: src/services/suggestion.service.ts
import { MedicalRecord } from '../models/MedicalRecord.model';

export class SuggestionService {
  private static symptomKeywords = [
    'Abdominal pain', 'Aggression', 'Anorexia', 'Anxiety',
    'Bad breath', 'Bleeding', 'Bloating', 'Breathing difficulty'
    // ... more symptoms
  ];

  private static medicineKeywords = [
    'Amoxicillin', 'Antihistamine', 'Antibiotic', 'Anti-inflammatory',
    'Pain reliever', 'Vitamin supplement', 'Flea treatment'
    // ... more medicines
  ];

  static async getSymptomsSuggestions(input: string): Promise<string[]> {
    const lowerInput = input.toLowerCase();
    return this.symptomKeywords
      .filter(symptom => symptom.toLowerCase().includes(lowerInput))
      .slice(0, 5);
  }

  static async getMedicinesSuggestions(input: string): Promise<string[]> {
    const lowerInput = input.toLowerCase();
    return this.medicineKeywords
      .filter(medicine => medicine.toLowerCase().includes(lowerInput))
      .slice(0, 5);
  }

  static async getHistoricalSuggestions(doctorId: string, petId: string) {
    const records = await MedicalRecord.find({ 
      doctor: doctorId, 
      pet: petId 
    });
    
    const symptoms = [...new Set(records.flatMap(r => r.symptoms))];
    const medicines = [...new Set(records.flatMap(r => r.prescribedMedications))];
    
    return { symptoms, medicines };
  }
}