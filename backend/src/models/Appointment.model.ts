//File: src/models/Appointment.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface IAppointment extends Document {
  pet: Types.ObjectId;
  doctor: Types.ObjectId;
  date: Date;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING
    },
    reason: { type: String, required: true },
    notes: { type: String }
  },
  { timestamps: true }
);

export default model<IAppointment>('Appointment', appointmentSchema);