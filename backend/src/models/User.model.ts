//File: src/models/User.model.ts
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IPetOwner, IDoctor, IUserMethods, UserModel } from '../interfaces';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         role:
 *           type: string
 *           enum: [doctor, petOwner]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - email
 *         - role
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT access token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
      select: false
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
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

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

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser, UserModel>('User', userSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     PetOwner:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             phone:
 *               type: string
 *               example: "+1234567890"
 *             address:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                   example: "123 Main St"
 *                 city:
 *                   type: string
 *                   example: "New York"
 *                 state:
 *                   type: string
 *                   example: "NY"
 *                 zipCode:
 *                   type: string
 *                   example: "10001"
 *                 country:
 *                   type: string
 *                   example: "USA"
 *             pets:
 *               type: array
 *               items:
 *                 type: string
 *                 format: objectId
 *               example: ["507f1f77bcf86cd799439012"]
 *           required:
 *             - firstName
 *             - lastName
 *             - phone
 *             - address
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
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Dr. Smith"
 *             specialization:
 *               type: string
 *               example: "Veterinary Surgery"
 *             hospital:
 *               type: string
 *               format: objectId
 *               example: "507f1f77bcf86cd799439013"
 *             contactNumber:
 *               type: string
 *               example: "+1234567890"
 *             availability:
 *               type: object
 *               properties:
 *                 days:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                 hours:
 *                   type: array
 *                   items:
 *                     type: string
 *                     pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
 *             appointments:
 *               type: array
 *               items:
 *                 type: string
 *                 format: objectId
 *           required:
 *             - name
 *             - specialization
 *             - hospital
 *             - contactNumber
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
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    }]
  },
  appointments: [{
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  }]
});

export const PetOwner = User.discriminator<IPetOwner>('petOwner', petOwnerSchema);
export const Doctor = User.discriminator<IDoctor>('doctor', doctorSchema);

export default User;