//File: src/controllers/medical.controller.ts
import { Request, Response } from 'express';
import MedicalRecord from '../models/MedicalRecord.model';
import Appointment from '../models/Appointment.model';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../errors/ApiError';
import * as suggestionService from '../services/suggestion.service';
import { AppointmentStatus, IRequestUser } from '../interfaces';
import { Pet } from '../models';
import {
  CreateMedicalRecordInput,
  UpdateMedicalRecordInput,
  SuggestTreatmentsInput
} from '../validations/medical.validation';

interface AuthenticatedRequest extends Request {
  user?: IRequestUser;
}

export const createMedicalRecord = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { body } = req as unknown as CreateMedicalRecordInput;
  const params = req.params as CreateMedicalRecordInput['params'];
  const doctorId = req.user?._id;
  
  if (!doctorId) {
    throw new ApiError(401, 'Not authenticated');
  }

  // Check if there's a confirmed appointment for this pet-doctor pair
  const appointment = await Appointment.findOne({
    pet: params.petId,
    doctor: doctorId,
    status: 'confirmed'
  });

  if (!appointment) {
    throw new ApiError(400, 'No confirmed appointment found for this pet and doctor');
  }

  // Create the medical record
  const medicalRecord = await MedicalRecord.create({
    ...body,
    pet: params.petId,
    doctor: doctorId,
    appointment: appointment._id,
    date: new Date() // Set current date as record date
  });

  // Update appointment status to completed
  appointment.status = 'completed' as AppointmentStatus;
  await appointment.save();

  res.status(201).json({
    status: 'success',
    data: medicalRecord
  });
});

export const getPetMedicalRecords = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const params = req.params as { petId: string };
  const query = req.query as { limit?: string; page?: string };
  const userId = req.user?._id;
  
  // Verify the pet belongs to the user (for pet owners)
  if (req.user?.role === 'petOwner') {
    const pet = await Pet.findById(params.petId);
    if (!pet || pet.owner.toString() !== userId?.toString()) {
      throw new ApiError(403, 'You can only view records for your own pets');
    }
  }

  const limit = query.limit ? parseInt(query.limit) : 10;
  const page = query.page ? parseInt(query.page) : 1;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    MedicalRecord.find({ pet: params.petId })
      .populate('doctor', 'name')
      .populate('appointment', 'date reason')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    MedicalRecord.countDocuments({ pet: params.petId })
  ]);

  res.json({
    status: 'success',
    data: records,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
});

export const suggestTreatments = catchAsync(async (req: Request, res: Response) => {
  const { body } = req as unknown as SuggestTreatmentsInput;
  
  const treatments = await suggestionService.getTreatmentSuggestions(body.symptoms);
  res.json({ 
    status: 'success',
    data: treatments 
  });
});

export const getMedicalRecord = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const record = await MedicalRecord.findById(id)
    .populate('doctor', 'name')
    .populate('pet', 'name')
    .populate('appointment', 'date reason');

  if (!record) {
    throw new ApiError(404, 'Medical record not found');
  }

  // Verify access
  if (req.user?.role === 'petOwner') {
    const pet = await Pet.findById(record.pet);
    if (!pet || pet.owner.toString() !== userId?.toString()) {
      throw new ApiError(403, 'You can only view records for your own pets');
    }
  } else if (req.user?.role === 'doctor' && record.doctor._id.toString() !== userId?.toString()) {
    throw new ApiError(403, 'You can only view your own medical records');
  }

  res.json({
    status: 'success',
    data: record
  });
});

export const updateMedicalRecord = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { body } = req as unknown as UpdateMedicalRecordInput;
  const { id } = req.params;
  const doctorId = req.user?._id;

  if (!doctorId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const record = await MedicalRecord.findById(id);
  if (!record) {
    throw new ApiError(404, 'Medical record not found');
  }

  if (record.doctor.toString() !== doctorId.toString()) {
    throw new ApiError(403, 'You can only update your own medical records');
  }

  // Handle null followUpDate explicitly
  const updateData = {
    ...body,
    ...(body.followUpDate === null && { followUpDate: null })
  };

  const updatedRecord = await MedicalRecord.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  res.json({
    status: 'success',
    data: updatedRecord
  });
});

export const getAppointmentRecords = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { appointmentId } = req.params;
  const userId = req.user?._id;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  // Verify access
  if (req.user?.role === 'petOwner') {
    const pet = await Pet.findById(appointment.pet);
    if (!pet || pet.owner.toString() !== userId?.toString()) {
      throw new ApiError(403, 'You can only view records for your own pets');
    }
  } else if (req.user?.role === 'doctor' && appointment.doctor.toString() !== userId?.toString()) {
    throw new ApiError(403, 'You can only view records for your own appointments');
  }

  const records = await MedicalRecord.find({ appointment: appointmentId })
    .populate('doctor', 'name')
    .sort({ date: -1 });

  res.json({
    status: 'success',
    data: records
  });
});