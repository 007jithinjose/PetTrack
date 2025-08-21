// File: src/interfaces/appointment.interface.ts
import { Document, Types } from 'mongoose';
import { IPet } from './pet.interface'; 
import { IDoctor, IPetOwner } from './user.interface';

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
  createdBy: Types.ObjectId | IPetOwner;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointmentPopulated extends Omit<IAppointment, 'pet' | 'doctor' | 'createdBy'> {
  pet: IPet;
  doctor: IDoctor;
  createdBy: IPetOwner;
}