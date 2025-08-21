//File: src/interfaces/vaccination.interface.ts
import { Document, Types } from 'mongoose';

export interface IVaccination extends Document {
  name: string;
  date: Date;
  nextDueDate: Date;
  administeredBy: Types.ObjectId; // Doctor ID
  pet: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}