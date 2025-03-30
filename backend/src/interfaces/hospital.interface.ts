//File: src/interfaces/hospital.interface.ts
import { Document, Types } from 'mongoose';
import { IDoctor } from './user.interface';

export interface IHospital extends Document {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactNumber: string;
  email: string;
  services: string[];
  doctors: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IHospitalPopulated extends Omit<IHospital, 'doctors'> {
  doctors: IDoctor[];
}