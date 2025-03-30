//File: src/interfaces/appointment.interface.ts
import { Document, Types } from 'mongoose';
import { IPet } from './pet.interface'; 
import { IDoctor } from './user.interface';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface IAppointment extends Document {
  pet: Types.ObjectId;
  doctor: Types.ObjectId;
  date: Date;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointmentPopulated extends Omit<IAppointment, 'pet' | 'doctor'> {
  pet: IPet;
  doctor: IDoctor;
}