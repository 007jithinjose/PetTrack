// File: src/interfaces/prescription.interface.ts
import { Document, Types } from 'mongoose';

export interface IPrescription extends Document {
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  doctor: Types.ObjectId;
  pet: Types.ObjectId;
  date: Date;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}