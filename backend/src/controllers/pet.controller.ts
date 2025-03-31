// File: src/controllers/pet.controller.ts
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Pet } from '../models';
import { ApiError } from '../errors/ApiError';
import httpStatus from 'http-status';

// Define authenticated request type
interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    id: string;
    role: string;
    [key: string]: any;
  };
}

export const createPet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const pet = await Pet.create({ 
    ...req.body,
    owner: req.user._id 
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    data: pet
  });
});

// Apply the same typing to all controller methods
export const getPets = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const pets = await Pet.find({ owner: req.user._id })
    .populate('vaccinations medicalRecords');

  res.status(httpStatus.OK).json({
    success: true,
    data: pets
  });
});

export const getPet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const pet = await Pet.findOne({ 
    _id: req.params.petId,
    owner: req.user._id 
  }).populate('vaccinations medicalRecords');

  if (!pet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pet not found');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: pet
  });
});

export const updatePet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const pet = await Pet.findOneAndUpdate(
    { 
      _id: req.params.petId,
      owner: req.user._id 
    },
    req.body,
    { new: true, runValidators: true }
  ).populate('vaccinations medicalRecords');

  if (!pet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pet not found');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: pet
  });
});

export const deletePet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const pet = await Pet.findOneAndDelete({ 
    _id: req.params.petId,
    owner: req.user._id 
  });

  if (!pet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pet not found');
  }

  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    data: null
  });
});