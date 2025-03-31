//File: src/interfaces/pet.interface.ts
import { Document, Types } from 'mongoose';
import { IPetOwner } from './user.interface';

export enum PetType {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  OTHER = 'other'
}

export interface IPet extends Document {
  name: string;
  type: PetType;
  breed: string;
  age: number;
  weight: number;
  owner: Types.ObjectId | IPetOwner;
  vaccinations: Types.ObjectId[];
  medicalRecords: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}