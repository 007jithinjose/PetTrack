//File: src/models/Vaccination.model.ts
import { Schema, model } from 'mongoose';
import { IVaccination } from '../interfaces';

const vaccinationSchema = new Schema<IVaccination>(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    nextDueDate: { type: Date, required: true },
    administeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    notes: { type: String }
  },
  { timestamps: true }
);

export default model<IVaccination>('Vaccination', vaccinationSchema);