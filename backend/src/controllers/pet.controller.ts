// File: src/controllers/pet.controller.ts
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Pet } from '../models';
import { ApiError } from '../errors/ApiError';
import httpStatus from 'http-status';
import { IRequestUser } from '../interfaces';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user: IRequestUser;
}

interface PetQuery {
  owner?: Types.ObjectId;
  _id?: Types.ObjectId;
  [key: string]: any;
}

export const createPet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { name, type, breed, age, weight } = req.body;
  
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
  }

  const pet = await Pet.create({ 
    name,
    type,
    breed,
    age,
    weight,
    owner: new Types.ObjectId(req.user._id)
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    data: pet
  });
});

export const getPets = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
  }

  // Initialize query with proper typing
  const query: PetQuery = {};

  // For pet owners, only return their pets
  if (req.user.role === 'petOwner') {
    query.owner = new Types.ObjectId(req.user._id);
  }

  const pets = await Pet.find(query)
    .populate('vaccinations')
    .populate('medicalRecords')
    .sort({ createdAt: -1 });

  res.status(httpStatus.OK).json({
    success: true,
    count: pets.length,
    data: pets
  });
});

export const getPet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { petId } = req.params;

  if (!Types.ObjectId.isValid(petId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid pet ID');
  }

  const query: PetQuery = {
    _id: new Types.ObjectId(petId)
  };

  // Add owner filter for pet owners
  if (req.user.role === 'petOwner') {
    query.owner = new Types.ObjectId(req.user._id);
  }

  const pet = await Pet.findOne(query)
    .populate('vaccinations')
    .populate('medicalRecords');

  if (!pet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pet not found or not authorized');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: pet
  });
});

export const updatePet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { petId } = req.params;
  const { name, breed, age, weight } = req.body;

  if (!Types.ObjectId.isValid(petId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid pet ID');
  }

  const query: PetQuery = {
    _id: new Types.ObjectId(petId),
    owner: new Types.ObjectId(req.user._id) // Always check ownership for updates
  };

  const updatedPet = await Pet.findOneAndUpdate(
    query,
    { name, breed, age, weight },
    { new: true, runValidators: true }
  ).populate('vaccinations medicalRecords');

  if (!updatedPet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pet not found or not authorized');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: updatedPet
  });
});

export const deletePet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { petId } = req.params;

  if (!Types.ObjectId.isValid(petId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid pet ID');
  }

  const query: PetQuery = {
    _id: new Types.ObjectId(petId),
    owner: new Types.ObjectId(req.user._id) // Always check ownership for deletion
  };

  const pet = await Pet.findOneAndDelete(query);

  if (!pet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pet not found or not authorized');
  }

  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    data: null
  });
});