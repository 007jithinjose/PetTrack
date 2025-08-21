// File: src/services/interfaces/medical.interface.ts
export interface MedicalRecordResponse {
  _id: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string[];
  prescribedMedications?: string[];
  doctor: {
    _id: string;
    name: string;
  };
  pet: {
    _id: string;
    name: string;
  };
  appointment?: {
    _id: string;
    date: string;
    reason: string;
  };
  notes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordInput {
  symptoms: string[];
  diagnosis: string;
  treatment: string[];
  prescribedMedications?: string[];
  notes?: string;
  followUpDate?: string;
}

export interface TreatmentSuggestionResponse {
  symptom: string;
  possibleDiagnoses: string[];
  suggestedTreatments: string[];
  suggestedMedications: string[];
  recommendedTests: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}