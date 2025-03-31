//File: src/models/MedicalRecord.model.ts
import { Schema, model } from 'mongoose';
import { IMedicalRecord } from '../interfaces';

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    date: { type: Date, required: true, default: Date.now },
    symptoms: [{ type: String, required: true }],
    diagnosis: { type: String, required: true },
    treatment: [{ type: String, required: true }],
    prescribedMedications: [{ type: String, required: true }],
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    notes: { type: String },
    followUpDate: { type: Date }
  },
  { timestamps: true }
);

export default model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);