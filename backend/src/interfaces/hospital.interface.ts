//File: src/interfaces/hospital.interface.ts
import { Document, Model, Types } from 'mongoose';
import { IDoctor } from './user.interface';

/**
 * @swagger
 * components:
 *   schemas:
 *     HospitalAddress:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - state
 *         - zipCode
 *         - country
 *       properties:
 *         street:
 *           type: string
 *           example: "123 Pet Care Ave"
 *         city:
 *           type: string
 *           example: "Metropolis"
 *         state:
 *           type: string
 *           example: "CA"
 *         zipCode:
 *           type: string
 *           example: "90210"
 *         country:
 *           type: string
 *           example: "USA"
 *
 *     HospitalInput:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - contactNumber
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           example: "City Veterinary Hospital"
 *         address:
 *           $ref: '#/components/schemas/HospitalAddress'
 *         contactNumber:
 *           type: string
 *           minLength: 10
 *           example: "555-123-4567"
 *         email:
 *           type: string
 *           format: email
 *           example: "info@cityvet.com"
 *         services:
 *           type: array
 *           items:
 *             type: string
 *             minLength: 2
 *           example: ["Emergency", "Surgery", "Dental"]
 *
 *     Hospital:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - contactNumber
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "City Veterinary Hospital"
 *         address:
 *           $ref: '#/components/schemas/HospitalAddress'
 *         contactNumber:
 *           type: string
 *           example: "555-123-4567"
 *         email:
 *           type: string
 *           format: email
 *           example: "info@cityvet.com"
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Emergency", "Surgery", "Dental"]
 *         doctors:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *           example: ["507f1f77bcf86cd799439012"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     HospitalForDoctorRegistration:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the hospital
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           description: The name of the hospital
 *           example: "City Veterinary Hospital"
 *
 *     DoctorReference:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         name:
 *           type: string
 *           example: "Dr. Sarah Johnson"
 *         email:
 *           type: string
 *           example: "s.johnson@hospital.com"
 *         specialization:
 *           type: string
 *           example: "Cardiology"
 *
 *   examples:
 *     HospitalRequest:
 *       value:
 *         name: "Metropolitan Animal Hospital"
 *         address:
 *           street: "456 Veterinary Way"
 *           city: "New York"
 *           state: "NY"
 *           zipCode: "10001"
 *           country: "USA"
 *         contactNumber: "212-555-7890"
 *         email: "contact@metrovet.com"
 *         services: ["Wellness", "Dermatology", "Orthopedics"]
 *     HospitalResponse:
 *       value:
 *         _id: "507f1f77bcf86cd799439011"
 *         name: "Metropolitan Animal Hospital"
 *         address:
 *           street: "456 Veterinary Way"
 *           city: "New York"
 *           state: "NY"
 *           zipCode: "10001"
 *           country: "USA"
 *         contactNumber: "212-555-7890"
 *         email: "contact@metrovet.com"
 *         services: ["Wellness", "Dermatology", "Orthopedics"]
 *         doctors: ["507f1f77bcf86cd799439012"]
 *         createdAt: "2023-05-15T10:00:00Z"
 *         updatedAt: "2023-05-15T10:00:00Z"
 *     HospitalError:
 *       value:
 *         message: "Validation failed"
 *         errors:
 *           - path: "email"
 *             message: "Invalid email format"
 */

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

export interface IHospitalMethods {
  addDoctor(doctorId: Types.ObjectId): Promise<IHospital>;
  removeDoctor(doctorId: Types.ObjectId): Promise<IHospital>;
}

export type HospitalModel = Model<IHospital, {}, IHospitalMethods>;