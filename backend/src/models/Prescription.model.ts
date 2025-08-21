//File: src/models/Prescription.model.ts
import { Schema, model } from 'mongoose';
import { IPrescription } from '../interfaces';

const prescriptionSchema = new Schema<IPrescription>(
  {
    medications: [{
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true }
    }],
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    date: { type: Date, required: true, default: Date.now },
    instructions: { type: String }
  },
  { timestamps: true }
);

export default model<IPrescription>('Prescription', prescriptionSchema);