////File: src/interfaces/medical.interface.ts
import { Document, Types } from 'mongoose';

export interface IMedicalRecord extends Document {
  date: Date;
  symptoms: string[];
  diagnosis: string;
  treatment: string[];
  prescribedMedications: string[];
  doctor: Types.ObjectId;
  pet: Types.ObjectId;
  notes?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISymptomSuggestion {
  symptom: string;
  possibleDiagnoses: string[];
  suggestedTreatments: string[];
  recommendedTests: string[];
}