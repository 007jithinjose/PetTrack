// File: src/controllers/doctor.controller.ts
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Appointment, MedicalRecord } from '../models';
import { ApiError } from '../errors/ApiError';
import httpStatus from 'http-status';
import { SuggestionService } from '../services/suggestion.service';

export const getPatients = catchAsync(async (req: Request, res: Response) => {
  const appointments = await Appointment.find({ doctor: req.user._id })
    .distinct('pet')
    .populate('pet');

  res.status(httpStatus.OK).json({
    success: true,
    data: appointments.map(a => a.pet)
  });
});

export const getMedicalHistory = catchAsync(async (req: Request, res: Response) => {
  const records = await MedicalRecord.find({
    pet: req.params.petId,
    doctor: req.user._id
  }).sort({ date: -1 });

  res.status(httpStatus.OK).json({
    success: true,
    data: records
  });
});

export const getSuggestions = catchAsync(async (req: Request, res: Response) => {
  const { type, input } = req.query;
  let suggestions: string[] = [];
  
  if (type === 'symptom') {
    suggestions = await SuggestionService.getSymptomsSuggestions(input as string);
  } else if (type === 'medicine') {
    suggestions = await SuggestionService.getMedicinesSuggestions(input as string);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: suggestions
  });
});

// Add more doctor-specific endpoints