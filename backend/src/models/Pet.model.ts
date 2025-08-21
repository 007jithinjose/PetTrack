//File: src/models/Pet.model.ts
import { Schema, model } from 'mongoose';
import { IPet, PetType } from '../interfaces';

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - breed
 *         - age
 *         - weight
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the pet
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [dog, cat, bird, other]
 *         breed:
 *           type: string
 *         age:
 *           type: number
 *         weight:
 *           type: number
 *         owner:
 *           type: string
 *           description: Reference to User ID
 *         vaccinations:
 *           type: array
 *           items:
 *             type: string
 *             description: Reference to Vaccination IDs
 *         medicalRecords:
 *           type: array
 *           items:
 *             type: string
 *             description: Reference to MedicalRecord IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const petSchema = new Schema<IPet>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(PetType), required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    weight: { type: Number, required: true, min: 0.1 },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vaccinations: [{ type: Schema.Types.ObjectId, ref: 'Vaccination' }],
    medicalRecords: [{ type: Schema.Types.ObjectId, ref: 'MedicalRecord' }]
  },
  { timestamps: true }
);

export default model<IPet>('Pet', petSchema);