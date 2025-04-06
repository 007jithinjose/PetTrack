// File: src/models/Appointment.model.ts
import { Schema, model, Document, Query } from 'mongoose';
import { IAppointment, AppointmentStatus } from '../interfaces/appointment.interface';

const appointmentSchema = new Schema<IAppointment>(
  {
    pet: { 
      type: Schema.Types.ObjectId, 
      ref: 'Pet', 
      required: true 
    },
    doctor: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    date: { 
      type: Date, 
      required: true,
      validate: {
        validator: function(value: Date) {
          return value > new Date();
        },
        message: 'Appointment date must be in the future'
      }
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING
    },
    reason: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 10
    },
    notes: { 
      type: String,
      trim: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    },
    toObject: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

// Virtual population for owner details (via pet)
appointmentSchema.virtual('owner', {
  ref: 'Pet',
  localField: 'pet',
  foreignField: '_id',
  justOne: true,
  options: { select: 'owner' }
});

// Virtual for pet details
appointmentSchema.virtual('petDetails', {
  ref: 'Pet',
  localField: 'pet',
  foreignField: '_id',
  justOne: true
});

// Virtual for doctor details
appointmentSchema.virtual('doctorDetails', {
  ref: 'User',
  localField: 'doctor',
  foreignField: '_id',
  justOne: true,
  match: { role: 'doctor' }
});

// Virtual for creator details
appointmentSchema.virtual('creatorDetails', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true
});

// Indexes for better query performance
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ pet: 1, date: 1 });
appointmentSchema.index({ status: 1, date: 1 });
appointmentSchema.index({ createdBy: 1, date: 1 });
appointmentSchema.index({ 'pet.owner': 1 });

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Type-safe pre-find hook
appointmentSchema.pre<Query<any, any>>(/^find/, function(next) {
  this.populate([
    {
      path: 'petDetails',
      select: 'name type breed age owner'
    },
    {
      path: 'doctorDetails',
      select: 'name email specialization'
    },
    {
      path: 'creatorDetails',
      select: 'name email'
    }
  ]);
  next();
});

export default model<IAppointment>('Appointment', appointmentSchema);