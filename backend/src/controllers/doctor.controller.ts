// File: src/controllers/doctor.controller.ts
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Appointment, MedicalRecord, Pet, User } from '../models';
import { ApiError } from '../errors/ApiError';
import httpStatus from 'http-status';
import { getTreatmentSuggestions as getSuggestionData } from '../services/suggestion.service';
import logger from '../utils/logger';
import { IRequestUser, IDoctor, IPetOwner,IMedicalRecord, ISymptomSuggestion,IPet } from '../interfaces';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user: IRequestUser & { _id: Types.ObjectId };
}

interface IPatientOwner {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  phone: string;
}

interface PatientWithOwner extends Omit<IPet, 'owner'> {
  owner: IPatientOwner;
}

export const getPatients = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const petIds = await Appointment.distinct('pet', { doctor: req.user._id });
  const totalCount = petIds.length;

  const pets = await Pet.find({ _id: { $in: petIds } })
    .skip(skip)
    .limit(limit)
    .populate<{ owner: IPetOwner }>('owner', 'firstName lastName phone')
    .select('name type breed age owner')
    .lean<PatientWithOwner[]>();

  logger.info(`Doctor ${req.user._id} accessed patient list`);

  res.status(httpStatus.OK).json({
    success: true,
    results: pets.length,
    total: totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    data: pets
  });
});

export const getMedicalHistory = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const pet = await Pet.findOne({
    _id: req.params.petId,
    owner: { $in: await Appointment.distinct('pet.owner', { doctor: req.user._id }) }
  });

  if (!pet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pet not found under your care');
  }

  const records = await MedicalRecord.find({
    pet: req.params.petId,
    doctor: req.user._id
  })
    .sort({ date: -1 })
    .select('date symptoms diagnosis treatment prescribedMedications notes followUpDate')
    .lean<IMedicalRecord[]>();

  res.status(httpStatus.OK).json({
    success: true,
    count: records.length,
    data: records
  });
});

export const getSuggestions = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Symptoms array is required');
  }

  const suggestions: ISymptomSuggestion[] = getSuggestionData(symptoms);

  logger.info(`Doctor ${req.user._id} requested treatment suggestions`);

  res.status(httpStatus.OK).json({
    success: true,
    count: suggestions.length,
    data: suggestions
  });
});

export const getDoctorProfile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const doctor = await User.findById(req.user._id)
    .select('-password -__v')
    .populate<{ hospital: { _id: Types.ObjectId, name: string, address: string, contactNumber: string } }>({
      path: 'hospital',
      select: 'name address contactNumber'
    })
    .lean<IDoctor>();

  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: doctor
  });
});

export const getDoctorAppointments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { status, date } = req.query;
  const query: { doctor: Types.ObjectId, status?: string, date?: { $gte: Date, $lt: Date } } = { 
    doctor: req.user._id 
  };

  if (status) query.status = status as string;
  if (date) {
    const startDate = new Date(date as string);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    query.date = { $gte: startDate, $lt: endDate };
  }

  const appointments = await Appointment.find(query)
    .populate('pet', 'name type')
    .populate('createdBy', 'firstName lastName')
    .sort({ date: 1 })
    .lean();

  res.status(httpStatus.OK).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

export const updateDoctorAvailability = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { days, hours } = req.body;

  if (!days || !hours || !Array.isArray(days) || !Array.isArray(hours)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Days and hours arrays are required');
  }

  const doctor = await User.findByIdAndUpdate(
    req.user._id,
    { 
      availability: {
        days,
        hours
      }
    },
    { new: true, runValidators: true }
  )
    .select('-password -__v')
    .lean<IDoctor>();

  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: doctor
  });
});