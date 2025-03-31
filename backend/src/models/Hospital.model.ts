//File: src/models/Hospital.model.ts
import { Schema, model, Model, Types } from 'mongoose';
import { IHospital, IHospitalMethods, HospitalModel } from '../interfaces';

const hospitalSchema = new Schema<IHospital, HospitalModel, IHospitalMethods>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true }
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    services: [{
      type: String,
      trim: true
    }],
    doctors: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

hospitalSchema.methods.addDoctor = async function(doctorId: Types.ObjectId) {
  if (!this.doctors.includes(doctorId)) {
    this.doctors.push(doctorId);
    await this.save();
  }
  return this;
};

hospitalSchema.methods.removeDoctor = async function(doctorId: Types.ObjectId) {
  this.doctors = this.doctors.filter(id => !id.equals(doctorId));
  await this.save();
  return this;
};

// Virtual for hospital's URL
hospitalSchema.virtual('url').get(function() {
  return `/hospitals/${this._id}`;
});

export default model<IHospital, HospitalModel>('Hospital', hospitalSchema);