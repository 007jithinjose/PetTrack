//File: src/interfaces/user.interface.ts
import { Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: 'doctor' | 'petOwner';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPetOwner extends IUser {
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pets: Types.ObjectId[];
}

export interface IDoctor extends IUser {
  name: string;
  specialization: string;
  hospital: Types.ObjectId;
  contactNumber: string;
  availability: {
    days: string[];
    hours: string[];
  };
  appointments: Types.ObjectId[];
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;