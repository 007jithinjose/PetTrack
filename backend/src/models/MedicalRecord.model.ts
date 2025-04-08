// File: src/models/MedicalRecord.model.ts
import { Schema, model } from 'mongoose';
import { IMedicalRecord } from '../interfaces';

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    date: { type: Date, required: true, default: Date.now },
    symptoms: [{ type: String, required: true }],
    diagnosis: { type: String, required: true },
    treatment: [{ type: String, required: true }],
    prescribedMedications: [{ type: String }],
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    notes: { type: String },
    followUpDate: { 
      type: Date,
      validate: {
        validator: function(date: Date) {
          // Allow null/undefined or dates today or in the future
          if (!date) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        message: 'Follow-up date must be today or in the future'
      }
    }
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Add indexes for better query performance
medicalRecordSchema.index({ pet: 1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ appointment: 1 });
medicalRecordSchema.index({ date: -1 });

export default model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);