import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IPetOwner, IDoctor, IUserMethods, UserModel } from '../interfaces';

/**
 * Base User Schema
 * @description Mongoose schema for the base User model
 */
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      select: false // Never return password in queries
    },
    role: {
      type: String,
      enum: ['doctor', 'petOwner'],
      required: true
    }
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password; // Ensure password is never sent in JSON responses
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

/**
 * Pre-save hook for password hashing
 * @description Hashes the password before saving to the database
 */
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Password comparison method
 * @description Compares a candidate password with the user's hashed password
 * @param candidatePassword - The password to compare
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the base User model
const User = model<IUser, UserModel>('User', userSchema);

/**
 * PetOwner Schema
 * @description Mongoose schema for PetOwner discriminator
 */
const petOwnerSchema = new Schema<IPetOwner>({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true }
  },
  pets: [{
    type: Schema.Types.ObjectId,
    ref: 'Pet'
  }]
});

/**
 * Doctor Schema
 * @description Mongoose schema for Doctor discriminator
 */
const doctorSchema = new Schema<IDoctor>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    hours: [{
      type: String,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    }]
  },
  appointments: [{
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  }]
});

// Create discriminator models
export const PetOwner = User.discriminator<IPetOwner>('petOwner', petOwnerSchema);
export const Doctor = User.discriminator<IDoctor>('doctor', doctorSchema);

export default User;