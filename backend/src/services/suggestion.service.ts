// File: src/services/suggestion.service.ts
import { ISymptomSuggestion } from '../interfaces';

const symptomTreatmentMap: Record<string, { treatments: string[], medications: string[] }> = {
  'fever': {
    treatments: [
      'Antipyretics (Paracetamol 10-15mg/kg every 8h)',
      'Fluid therapy (IV or SC)',
      'Rest and isolation',
      'Antibiotics if bacterial infection (Amoxicillin-Clavulanate 12.5mg/kg)',
      'Cool compresses',
      'Blood culture if fever >104°F',
      'Monitor temperature every 4 hours',
      'Environmental cooling',
      'NSAIDs if no contraindications',
      'Hospitalization if febrile >72h'
    ],
    medications: [
      'Paracetamol (Acetaminophen)',
      'Carprofen (Rimadyl)',
      'Meloxicam (Metacam)',
      'Amoxicillin-Clavulanate (Clavamox)',
      'Enrofloxacin (Baytril)',
      'Cefovecin (Convenia)',
      'Maropitant (Cerenia) for nausea',
      'Diphenhydramine (Benadryl)',
      'Fluids (Lactated Ringers, Normosol)',
      'Vitamin B complex'
    ]
  },
  'vomiting': {
    treatments: [
      'NPO for 12-24 hours',
      'Gradual reintroduction of bland diet',
      'Fluid therapy (IV or SC)',
      'Anti-emetic therapy',
      'Gastroprotectants',
      'Dietary modification',
      'Abdominal ultrasound',
      'Pancreatic enzyme testing',
      'Monitor for dehydration',
      'Hospitalization if persistent'
    ],
    medications: [
      'Maropitant (Cerenia) 1mg/kg',
      'Ondansetron 0.1-0.2mg/kg',
      'Metoclopramide 0.2-0.5mg/kg',
      'Famotidine 0.5mg/kg',
      'Omeprazole 0.7-1mg/kg',
      'Sucralfate 0.5-1g/dog',
      'Probiotics (FortiFlora)',
      'Kaolin-Pectin (Kaopectate)',
      'Dimenhydrinate 4-8mg/kg',
      'Dolasetron 0.5mg/kg'
    ]
  },
  'diarrhea': {
    treatments: [
      'Fasting for 12-24h',
      'Bland diet (boiled chicken/rice)',
      'Probiotic supplementation',
      'Fluid therapy',
      'Fecal examination',
      'Pancreatic function tests',
      'Diet trial',
      'Endoscopy if chronic',
      'Antidiarrheal medication',
      'Monitor hydration status'
    ],
    medications: [
      'Metronidazole 10-15mg/kg',
      'Tylosin 5-10mg/kg',
      'Probiotics (Proviable)',
      'Kaolin-Pectin',
      'Loperamide 0.08-0.1mg/kg',
      'Saccharomyces boulardii',
      'Pancreatic enzymes',
      'Psyllium fiber',
      'Dewormers (Fenbendazole)',
      'Maropitant for nausea'
    ]
  },
  'coughing': {
    treatments: [
      'Thoracic radiographs',
      'Bronchodilators',
      'Antitussives',
      'Antibiotics if indicated',
      'Nebulization therapy',
      'Tracheal wash',
      'Environmental modification',
      'Weight management',
      'Cardiac evaluation',
      'Allergy testing'
    ],
    medications: [
      'Doxycycline 5mg/kg',
      'Clindamycin 5.5mg/kg',
      'Theophylline 5-10mg/kg',
      'Terbutaline 0.01mg/kg',
      'Hydrocodone 0.22mg/kg',
      'Butorphanol 0.05-0.1mg/kg',
      'Prednisolone 0.5mg/kg',
      'Cyclosporine 5mg/kg',
      'Amlodipine 0.1mg/kg',
      'Furosemide 1-2mg/kg'
    ]
  },
};


const commonMedications = [
  'Amoxicillin (10-20mg/kg q12h)',
  'Amoxicillin-Clavulanate (12.5-25mg/kg q12h)',
  'Cephalexin (22mg/kg q12h)',
  'Enrofloxacin (5-10mg/kg q24h)',
  'Doxycycline (5mg/kg q12h)',
  'Clindamycin (5.5mg/kg q12h)',
  'Metronidazole (10-15mg/kg q12h)',
  'Marbofloxacin (2.75mg/kg q24h)',
  'Cefovecin (8mg/kg SC q14d)',
  'Trimethoprim-Sulfa (15mg/kg q12h)',
  'Carprofen (2.2mg/kg q12h)',
  'Meloxicam (0.1mg/kg q24h)',
  'Firocoxib (5mg/kg q24h)',
  'Grapiprant (2mg/kg q24h)',
  'Tramadol (2-5mg/kg q8-12h)',
  'Gabapentin (5-10mg/kg q8-12h)',
  'Amitriptyline (1-2mg/kg q12h)',
  'Fluoxetine (1mg/kg q24h)',
  'Trazodone (3-5mg/kg q8-12h)',
  'Diazepam (0.5mg/kg PRN)',
  'Phenobarbital (2-5mg/kg q12h)',
  'Potassium Bromide (30mg/kg q24h)',
  'Levetiracetam (20mg/kg q8h)',
  'Prednisolone (0.5-1mg/kg q24h)',
  'Cyclosporine (5mg/kg q24h)',
  'Oclacitinib (0.4-0.6mg/kg q12h)',
  'Diphenhydramine (1mg/kg q8h)',
  'Chlorpheniramine (0.4mg/kg q12h)',
  'Famotidine (0.5mg/kg q12h)',
  'Omeprazole (0.7-1mg/kg q24h)',
  'Sucralfate (0.5-1g/dog q8h)',
  'Metoclopramide (0.2-0.5mg/kg q8h)',
  'Maropitant (1mg/kg q24h)',
  'Ondansetron (0.1-0.2mg/kg q12h)',
  'Furosemide (1-2mg/kg q8-12h)',
  'Spironolactone (1-2mg/kg q12h)',
  'Enalapril (0.5mg/kg q12h)',
  'Pimobendan (0.25mg/kg q12h)',
  'Amlodipine (0.1mg/kg q24h)',
  'Insulin Glargine (0.25U/kg q12h)',
  'Mirtazapine (0.5mg/kg q72h)',
  'Thyroxine (0.02mg/kg q12h)',
  'Methimazole (2.5mg/cat q12h)',
  'Fenbendazole (50mg/kg q24h x3d)',
  'Praziquantel (5mg/kg once)',
  'Selamectin (6mg/kg monthly)',
  'Fluralaner (25mg/kg q12w)',
  'Afoxolaner (2.5mg/kg monthly)',
  'Milbemycin (0.5mg/kg monthly)',
  'Fluconazole (5mg/kg q24h)',
  'Itraconazole (5mg/kg q24h)'
];

const commonDiagnoses = [
  'Canine Parvovirus Enteritis',
  'Feline Panleukopenia',
  'Kennel Cough (CIRDC)',
  'Feline Upper Respiratory Infection',
  'Acute Gastroenteritis',
  'Hemorrhagic Gastroenteritis',
  'Pancreatitis',
  'Inflammatory Bowel Disease',
  'Food Responsive Enteropathy',
  'Intestinal Parasitism',
  'Giardiasis',
  'Salmon Poisoning Disease',
  'Pyoderma',
  'Dermatitis',
  'Atopic Dermatitis',
  'Flea Allergy Dermatitis',
  'Food Allergy',
  'Otitis Externa',
  'Otitis Media/Interna',
  'Periodontal Disease',
  'Tooth Root Abscess',
  'Stomatitis',
  'Esophagitis',
  'Gastritis',
  'Gastric Ulceration',
  'Foreign Body Obstruction',
  'Intussusception',
  'Colitis',
  'Megacolon',
  'Hepatic Lipidosis',
  'Cholangiohepatitis',
  'Portosystemic Shunt',
  'Chronic Kidney Disease',
  'Acute Kidney Injury',
  'Urolithiasis (Struvite, Calcium Oxalate)',
  'UTI (Cystitis)',
  'Pyelonephritis',
  'Feline Lower Urinary Tract Disease',
  'Hyperthyroidism',
  'Hypothyroidism',
  'Diabetes Mellitus',
  'Hypoadrenocorticism',
  'Hyperadrenocorticism',
  'Cardiomyopathy (DCM, HCM)',
  'Valvular Disease',
  'Heartworm Disease',
  'Pulmonary Hypertension',
  'Tracheal Collapse',
  'Asthma',
  'Pneumonia',
  'Pleural Effusion',
  'Neoplasia (Lymphoma, Mast Cell Tumor)'
];

const commonTests = [
  'Complete Blood Count (CBC)',
  'Blood Chemistry Panel (BUN, Creatinine, ALT, ALP)',
  'Electrolyte Panel',
  'Blood Gas Analysis',
  'Coagulation Profile (PT, PTT)',
  'Blood Pressure Measurement',
  'Urinalysis with Sediment Exam',
  'Urine Culture & Sensitivity',
  'Fecal Floatation',
  'Fecal PCR Panel',
  'Giardia ELISA',
  'Heartworm Antigen Test',
  'Tick-Borne Disease Panel',
  'Thyroid Function Test (T4, fT4)',
  'Cortisol Level (ACTH Stim)',
  'Bile Acids Test',
  'Pancreatic Lipase (Spec cPL/fPL)',
  'ProBNP Test',
  'Blood Glucose Curve',
  'Fructosamine Level',
  'Cytology (Ear, Skin, Mass)',
  'Histopathology',
  'Radiographs (Thoracic, Abdominal)',
  'Ultrasound (Abdominal, Cardiac)',
  'Echocardiogram',
  'Electrocardiogram (ECG)',
  'Endoscopy (Upper GI, Lower GI)',
  'Bronchoscopy',
  'Rhinoscopy',
  'CT Scan',
  'MRI',
  'Bone Marrow Aspirate',
  'Joint Tap Analysis',
  'Allergy Testing (Intradermal, Serum)',
  'Food Trial (Hydrolyzed Protein)',
  'Blood Typing',
  'Crossmatching',
  'Coomb\'s Test',
  'Lyme Quantitative C6 Test',
  'Leptospirosis PCR',
  'Fungal Culture',
  'Bacterial Culture & Sensitivity',
  'PCR Testing (Various Pathogens)',
  'Toxicology Screen',
  'Heavy Metal Testing',
  'Vitamin Level Testing',
  'Genetic Testing',
  'Cytologic Evaluation of Effusions',
  'CSF Analysis',
  'Blood Smear Evaluation',
  'Coagulation Time Tests'
];

export const getTreatmentSuggestions = (symptoms: string[]): ISymptomSuggestion[] => {
  return symptoms.map(symptom => {
    const lowerSymptom = symptom.toLowerCase();
    const symptomData = symptomTreatmentMap[lowerSymptom] || {
      treatments: [],
      medications: []
    };

    return {
      symptom: symptom,
      possibleDiagnoses: [...commonDiagnoses]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5), 
      suggestedTreatments: [
        ...symptomData.treatments,
        ...commonMedications
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
      ],
      suggestedMedications: [
        ...symptomData.medications,
        ...commonMedications
          .filter(med => !symptomData.medications.includes(med))
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
      ],
      recommendedTests: [...commonTests]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5) 
    };
  });
};