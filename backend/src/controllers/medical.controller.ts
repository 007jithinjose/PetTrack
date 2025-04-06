// File: src/controllers/medical.controller.ts
import { Request, Response } from 'express';
import MedicalRecord from '../models/MedicalRecord.model';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../errors/ApiError';
import * as suggestionService from '../services/suggestion.service';

export const createMedicalRecord = catchAsync(async (req: Request, res: Response) => {
  const { petId } = req.params;
  const medicalRecord = await MedicalRecord.create({
    ...req.body,
    pet: petId,
    doctor: req.user?._id || null
  });
  res.status(201).json(medicalRecord);
});

export const getPetMedicalRecords = catchAsync(async (req: Request, res: Response) => {
  const { petId } = req.params;
  const records = await MedicalRecord.find({ pet: petId })
    .populate('doctor')
    .sort({ date: -1 });
  res.json(records);
});

export const suggestTreatments = catchAsync(async (req: Request, res: Response) => {
  const { symptoms } = req.body;
  if (!symptoms || !Array.isArray(symptoms)) {
    throw new ApiError(400, 'Symptoms array is required');
  }
  const treatments = await suggestionService.getTreatmentSuggestions(symptoms);
  res.json({ treatments });
});