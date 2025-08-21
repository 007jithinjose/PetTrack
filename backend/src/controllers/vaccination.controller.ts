//File: src/controllers/vaccination.controller.ts
import { Request, Response } from 'express';
import Vaccination from '../models/Vaccination.model';
import { catchAsync } from '../utils/catchAsync';
import {ApiError} from '../errors/ApiError';
import { sendVaccinationReminder } from '../services/notification.service';

export const addVaccination = catchAsync(async (req: Request, res: Response) => {
  const { petId } = req.params;
  const vaccination = await Vaccination.create({
    ...req.body,
    pet: petId,
    administeredBy: req.user ? req.user._id : null
  });
  
  // Schedule reminder
  await sendVaccinationReminder(vaccination);
  
  res.status(201).json(vaccination);
});

export const getPetVaccinations = catchAsync(async (req: Request, res: Response) => {
  const { petId } = req.params;
  const vaccinations = await Vaccination.find({ pet: petId })
    .populate('administeredBy')
    .sort({ date: -1 });
  res.json(vaccinations);
});

export const getUpcomingVaccinations = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }
  const { _id: ownerId } = req.user;
  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
  
  const vaccinations = await Vaccination.find({
    pet: { $in: req.user.pets },
    nextDueDate: { $lte: nextMonth }
  }).populate('pet');
  
  res.json(vaccinations);
});