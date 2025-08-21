// File: src/services/interfaces/prescription.interface.ts
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PrescriptionResponse {
  _id: string;
  medications: Medication[];
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
  date: string;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionInput {
  medications: Medication[];
  instructions?: string;
}