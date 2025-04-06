// File: src/interfaces/dto.interface.ts
import { PetType } from './pet.interface';
import { Types } from 'mongoose';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AddressDTO {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface RegisterPetOwnerDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: AddressDTO;
}

export interface AvailabilityDTO {
  days: string[];
  hours: string[];
}

export interface RegisterDoctorDTO {
  email: string;
  password: string;
  name: string;
  specialization: string;
  hospital: Types.ObjectId;
  contactNumber: string;
  availability?: AvailabilityDTO;
}

export interface CreatePetDTO {
  name: string;
  type: PetType;
  breed: string;
  age: number;
  weight: number;
  ownerId: Types.ObjectId;
}

export interface UpdatePetDTO {
  name?: string;
  breed?: string;
  age?: number;
  weight?: number;
}

export interface CreateAppointmentDTO {
  petId: Types.ObjectId;
  doctorId: Types.ObjectId;
  date: Date;
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentDTO {
  petId: any;
  doctorId: any;
  date?: Date;
  reason?: string;
  notes?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface CreateVaccinationDTO {
  petId: Types.ObjectId;
  name: string;
  administeredDate: Date;
  expirationDate: Date;
  administeredBy: Types.ObjectId;
  notes?: string;
}

export interface CreateMedicalRecordDTO {
  petId: Types.ObjectId;
  doctorId: Types.ObjectId;
  diagnosis: string;
  treatment: string;
  notes?: string;
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
}