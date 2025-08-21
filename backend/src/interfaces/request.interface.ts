// File: src/interfaces/request.interface.ts
import { Types } from 'mongoose';

export interface IRequestUser {
  _id: string;
  id: string;
  role: 'doctor' | 'petOwner' | 'admin';
  pets?: Types.ObjectId[]; // For pet owners
  firstName?: string;
  lastName?: string;
}