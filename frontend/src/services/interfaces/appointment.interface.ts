// src/services/interfaces/appointment.interface.ts
import { Pet } from './pet.interface';
import { User } from './auth.interface';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  MISSED = 'missed',
  RESCHEDULED = 'rescheduled'
}

// Create a type for the allowed status values in queries
export type QueryableAppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface Appointment {
  id: string;
  pet: string | Pet;
  doctor: string | User;
  date: Date | string;
  reason: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: string | User;
  petDetails?: { name: string };
  doctorDetails?: { name: string };
  formattedDate?: string;
}

export interface AppointmentQueryParams {
  petId?: string;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
  status?: QueryableAppointmentStatus; // Use the restricted type here
  page?: number;
  limit?: number;
}

export interface PaginatedAppointments {
  data: Appointment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}