//File: src/models/Hospital.model.ts
import { Schema, model, Document, Types } from 'mongoose';

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

const hospitalSchema = new Schema<IHospital>(
  {
    name: { type: String, required: true, unique: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    services: [{ type: String }],
    doctors: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default model<IHospital>('Hospital', hospitalSchema);