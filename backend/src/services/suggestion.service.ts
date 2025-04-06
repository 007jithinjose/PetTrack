// File: src/services/suggestion.service.ts
import { ISymptomSuggestion } from '../interfaces';

// Comprehensive symptom-treatment mappings
const symptomTreatmentMap: Record<string, string[]> = {
  'fever': ['Antipyretics (e.g., Paracetamol)', 'Fluid therapy', 'Rest', 'Antibiotics if infection suspected'],
  'vomiting': ['Anti-emetics (e.g., Maropitant)', 'Fluid therapy', 'NPO for 12-24 hours', 'Bland diet reintroduction'],
  'diarrhea': ['Probiotics', 'Anti-diarrheals (e.g., Metronidazole)', 'Bland diet', 'Fluid therapy'],
  'coughing': ['Antitussives', 'Bronchodilators', 'Antibiotics if bacterial infection', 'Chest physiotherapy'],
  'sneezing': ['Antihistamines', 'Nasal decongestants', 'Antibiotics if secondary infection', 'Environmental allergen control'],
  'itching': ['Antihistamines', 'Corticosteroids', 'Topical anti-itch sprays', 'Essential fatty acid supplements'],
  'lethargy': ['Blood work to diagnose underlying cause', 'Supportive care', 'IV fluids if dehydrated', 'Nutritional support'],
  'weight loss': ['Deworming if parasites suspected', 'Diet adjustment', 'Thyroid testing', 'Pancreatic function tests'],
  'lameness': ['Pain medication (e.g., NSAIDs)', 'Joint supplements', 'Rest', 'X-rays to assess bone/joint health'],
  'red eyes': ['Ophthalmic antibiotics', 'Anti-inflammatory eye drops', 'Artificial tears', 'Elizabethan collar to prevent rubbing'],
  'ear discharge': ['Ear cleaning solution', 'Topical antibiotics', 'Oral antibiotics if severe', 'Anti-inflammatory medication'],
  'hair loss': ['Skin scrapings for parasites', 'Thyroid testing', 'Essential fatty acids', 'Antifungals if ringworm suspected'],
  'increased thirst': ['Blood glucose test', 'Kidney function tests', 'Urinalysis', 'Diet adjustment'],
  'seizures': ['Emergency anticonvulsants (e.g., Diazepam)', 'Long-term seizure control (e.g., Phenobarbital)', 'Blood work', 'Neurological exam'],
  'swollen joints': ['NSAIDs for pain/inflammation', 'Joint fluid analysis', 'Rest', 'Possible joint supplements'],
  'bad breath': ['Dental cleaning', 'Antibiotics for gum disease', 'Dental chews', 'Oral rinses'],
  'pale gums': ['Blood work for anemia', 'Iron supplements if indicated', 'Deworming', 'Emergency care if severe'],
  'rapid breathing': ['Oxygen therapy if needed', 'Chest X-rays', 'Diuretics if pulmonary edema', 'Stress reduction'],
  'abdominal pain': ['Pain medication', 'X-rays/ultrasound', 'Blood work', 'NPO and IV fluids'],
  'blood in urine': ['Urinalysis', 'Antibiotics for UTI', 'Increased water intake', 'X-rays for stones']
};

const commonMedications = [
  'Antibiotics (e.g., Amoxicillin, Enrofloxacin)',
  'NSAIDs (e.g., Carprofen, Meloxicam)',
  'Antihistamines (e.g., Diphenhydramine)',
  'Probiotics',
  'Dewormers (e.g., Fenbendazole)',
  'Flea/tick preventatives',
  'Joint supplements (e.g., Glucosamine)',
  'Essential fatty acids (Omega-3/6)',
  'Anti-anxiety medications (e.g., Trazodone)',
  'Appetite stimulants (e.g., Mirtazapine)'
];

const commonDiagnoses = [
  'Viral infection',
  'Bacterial infection',
  'Parasitic infestation',
  'Allergic reaction',
  'Autoimmune disorder',
  'Metabolic disease',
  'Endocrine disorder',
  'Trauma/injury',
  'Toxin exposure',
  'Neoplasia'
];

const commonTests = [
  'Complete Blood Count (CBC)',
  'Blood Chemistry Panel',
  'Urinalysis',
  'Fecal examination',
  'Skin scrapings',
  'X-rays',
  'Ultrasound',
  'Biopsy',
  'Culture and sensitivity',
  'Allergy testing'
];

export const getTreatmentSuggestions = (symptoms: string[]): ISymptomSuggestion[] => {
  return symptoms.map(symptom => ({
    symptom: symptom,
    possibleDiagnoses: commonDiagnoses.filter(() => Math.random() > 0.7), // Random selection for demo
    suggestedTreatments: [
      ...(symptomTreatmentMap[symptom.toLowerCase()] || []),
      ...commonMedications.filter(() => Math.random() > 0.8) // Add some random common meds
    ],
    recommendedTests: commonTests.filter(() => Math.random() > 0.6) // Random selection for demo
  }));
};