// File: src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { User, PetOwner, Doctor, Hospital } from '../models';
import { generateToken } from '../utils/jwt';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../errors/ApiError';
import { IUser, IPetOwner, IDoctor } from '../interfaces';
import { Types } from 'mongoose';

export const authController = {
  registerPetOwner: catchAsync(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone, address } = req.body;
    
    if (await User.findOne({ email })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    const petOwner = await PetOwner.create({ 
      email, 
      password, 
      role: 'petOwner',
      firstName,
      lastName,
      phone,
      address
    });

    sendAuthResponse(res, petOwner as unknown as IPetOwner & Document);
  }),

  registerDoctor: catchAsync(async (req: Request, res: Response) => {
    const { email, password, name, specialization, hospital, contactNumber } = req.body;
    
    // Validate email
    if (await User.findOne({ email })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    // Validate hospital ID format
    if (!Types.ObjectId.isValid(hospital)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid hospital ID');
    }

    // Check hospital exists
    const hospitalExists = await Hospital.findById(hospital);
    if (!hospitalExists) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Hospital not found');
    }

    // Create doctor
    const doctor = await Doctor.create({ 
      email, 
      password, 
      role: 'doctor',
      name,
      specialization,
      hospital,
      contactNumber
    });

    // Add doctor to hospital's doctors array
    await Hospital.findByIdAndUpdate(
      hospital,
      { $addToSet: { doctors: doctor._id } },
      { new: true, runValidators: true }
    );

    sendAuthResponse(res, doctor as unknown as IDoctor & Document);
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    // Fetch the full document based on role
    if (user.role === 'petOwner') {
      const petOwner = await PetOwner.findById(user._id);
      if (!petOwner) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      sendAuthResponse(res, petOwner as unknown as IPetOwner & Document);
    } else {
      const doctor = await Doctor.findById(user._id);
      if (!doctor) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      sendAuthResponse(res, doctor as unknown as IDoctor & Document);
    }
  })
};

// Helper function with proper typing
function sendAuthResponse(
  res: Response, 
  user: (IPetOwner & Document) | (IDoctor & Document)
) {
  // Type guard to ensure we have a Mongoose document
  if (!('_id' in user)) {
    throw new Error('Invalid user document');
  }

  // Convert to plain object and remove sensitive data
  const userObj = user.toObject();
  const { password, __v, ...userData } = userObj;
  
  // Generate token with both id and _id (convert ObjectId to string)
  const token = generateToken(
    (user as any).id.toString(), // id
    (user as any)._id.toString(), // _id
    (user as any).role
  );

  res.status(httpStatus.OK).json({
    success: true,
    data: {
      user: userData,
      token
    }
  });
}