// File: src/controllers/appointment.controller.ts
import { Request, Response, NextFunction } from 'express';
import { IAppointmentPopulated, AppointmentStatus } from '../interfaces';
import { Appointment } from '../models';
import { catchAsync } from '../utils/catchAsync';
import { BadRequestError, NotFoundError, ForbiddenError } from '../errors/ApiError';
import { IRequestUser } from '../interfaces/request.interface';
import { 
  createAppointmentSchema,
  updateAppointmentSchema,
  rescheduleAppointmentSchema,
  completeAppointmentSchema,
  appointmentQuerySchema
} from '../validations/appointment.validation';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Pet } from '../models/';

// Helper to format Zod errors
const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
};

export const createAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IRequestUser;
  
  // Validate request
  const validation = createAppointmentSchema.safeParse({ body: req.body });
  if (!validation.success) {
    return next(new BadRequestError('Validation failed', formatZodError(validation.error)));
  }

  const { petId, doctorId, date, reason, notes } = validation.data.body;

  // Create appointment
  const appointment = new Appointment({
    pet: petId,
    doctor: doctorId,
    date: new Date(date),
    reason,
    notes,
    status: AppointmentStatus.PENDING,
    createdBy: user._id
  });

  await appointment.save();

  // Return populated appointment
  const populated = await Appointment.findById(appointment._id)
    .populate<Pick<IAppointmentPopulated, 'pet' | 'doctor' | 'createdBy'>>('pet doctor createdBy');

  res.status(201).json({
    success: true,
    data: populated
  });
});

export const getAppointments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IRequestUser;
  
  // Validate query
  const validation = appointmentQuerySchema.safeParse({ query: req.query });
  if (!validation.success) {
    return next(new BadRequestError('Invalid query', formatZodError(validation.error)));
  }

  const { petId, doctorId, startDate, endDate, status, page = 1, limit = 10 } = validation.data.query;

  // Build query
  const query: any = {};
  
  // For pet owners, show appointments for their pets
  if (user.role === 'petOwner') {
    // First find all pets belonging to this owner
    const pets = await Pet.find({ owner: user._id }).select('_id');
    const petIds = pets.map(pet => pet._id);
    
    query.pet = { $in: petIds };
  } 
  // For doctors, show their own appointments
  else if (user.role === 'doctor') {
    query.doctor = user._id;
  }

  if (petId) {
    const petIds = Array.isArray(petId) ? petId : [petId];
    query.pet = { $in: petIds };
  }
  if (doctorId) query.doctor = doctorId;
  if (status) query.status = status;

  // Date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Execute query
  const [total, appointments] = await Promise.all([
    Appointment.countDocuments(query),
    Appointment.find(query)
      .populate('pet doctor createdBy')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
  ]);

  res.json({
    success: true,
    data: appointments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
export const getAppointmentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as IRequestUser;

  const appointment = await Appointment.findById(id)
    .populate<Pick<IAppointmentPopulated, 'pet' | 'doctor' | 'createdBy'>>('pet doctor createdBy');

  if (!appointment) {
    return next(new NotFoundError('Appointment not found'));
  }

  // Authorization
  const isAuthorized = user.role === 'admin' || 
    (user.role === 'doctor' && appointment.doctor._id.equals(user._id)) ||
    (user.role === 'petOwner' && appointment.createdBy._id.equals(user._id));

  if (!isAuthorized) {
    return next(new ForbiddenError('Not authorized to access this appointment'));
  }

  res.json({
    success: true,
    data: appointment
  });
});

export const updateAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as IRequestUser;

  // Validate request
  const validation = updateAppointmentSchema.safeParse({ body: req.body });
  if (!validation.success) {
    return next(new BadRequestError('Validation failed', formatZodError(validation.error)));
  }

  const existing = await Appointment.findById(id);
  if (!existing) {
    return next(new NotFoundError('Appointment not found'));
  }

  // Authorization
  if (![existing.doctor, existing.createdBy].some(id => 
    id instanceof mongoose.Types.ObjectId && id.equals(user._id)
  )) {
    return next(new ForbiddenError('Not authorized to update this appointment'));
  }

  // Prepare update
  const updateData = { ...validation.data.body };
  if (updateData.date) {
    updateData.date = new Date(updateData.date).toISOString();
  }

  const updated = await Appointment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate('pet doctor createdBy');

  res.json({
    success: true,
    data: updated
  });
});

export const cancelAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as IRequestUser;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new NotFoundError('Appointment not found'));
  }

  // Authorization
  if (![appointment.doctor, appointment.createdBy].some(id => 
    id instanceof mongoose.Types.ObjectId && id.equals(user._id)
  )) {
    return next(new ForbiddenError('Not authorized to cancel this appointment'));
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    return next(new BadRequestError('Appointment is already cancelled'));
  }

  const updated = await Appointment.findByIdAndUpdate(
    id,
    { status: AppointmentStatus.CANCELLED },
    { new: true }
  ).populate('pet doctor createdBy');

  res.json({
    success: true,
    data: updated
  });
});

export const completeAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as IRequestUser;

  // Validate request
  const validation = completeAppointmentSchema.safeParse({ body: req.body });
  if (!validation.success) {
    return next(new BadRequestError('Validation failed', formatZodError(validation.error)));
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new NotFoundError('Appointment not found'));
  }

  // Only the assigned doctor can complete
  if (!appointment.doctor.equals(user._id)) {
    return next(new ForbiddenError('Only the assigned doctor can complete this appointment'));
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    return next(new BadRequestError('Appointment is already completed'));
  }

  const updated = await Appointment.findByIdAndUpdate(
    id,
    {
      status: AppointmentStatus.COMPLETED,
      notes: validation.data.body.notes || appointment.notes
    },
    { new: true }
  ).populate('pet doctor createdBy');

  res.json({
    success: true,
    data: updated
  });
});

export const rescheduleAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as IRequestUser;

  // Validate request
  const validation = rescheduleAppointmentSchema.safeParse({ body: req.body });
  if (!validation.success) {
    return next(new BadRequestError('Validation failed', formatZodError(validation.error)));
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new NotFoundError('Appointment not found'));
  }

  // Authorization
  if (![appointment.doctor, appointment.createdBy].some(id => 
    id instanceof mongoose.Types.ObjectId ? id.equals(user._id) : id._id.equals(user._id)
  )) {
    return next(new ForbiddenError('Not authorized to reschedule this appointment'));
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    return next(new BadRequestError('Cannot reschedule a cancelled appointment'));
  }

  const newDate = new Date(validation.data.body.date);
  const updated = await Appointment.findByIdAndUpdate(
    id,
    { date: newDate },
    { new: true }
  ).populate('pet doctor createdBy');

  res.json({
    success: true,
    data: updated
  });
});

export const getDoctorAppointments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IRequestUser;
  
  // Validate query
  const validation = appointmentQuerySchema.safeParse({ query: req.query });
  if (!validation.success) {
    return next(new BadRequestError('Validation failed', formatZodError(validation.error)));
  }

  const { status, page = 1, limit = 10 } = validation.data.query;

  // Build query - only show appointments for this doctor
  const query: any = { doctor: user._id };

  if (status) {
    query.status = status;
  }

  // Execute query
  const [total, appointments] = await Promise.all([
    Appointment.countDocuments(query),
    Appointment.find(query)
      .populate('pet doctor createdBy')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
  ]);

  res.json({
    success: true,
    data: appointments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getUpcomingAppointments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IRequestUser;
  
  const { page = 1, limit = 10 } = req.query;

  const query = { 
    doctor: user._id,
    date: { $gte: new Date() },
    status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] }
  };

  const [total, appointments] = await Promise.all([
    Appointment.countDocuments(query),
    Appointment.find(query)
      .populate('pet createdBy')
      .sort({ date: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
  ]);

  res.json({
    success: true,
    data: appointments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

export const getPastAppointments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IRequestUser;
  
  const { page = 1, limit = 10 } = req.query;

  const query = { 
    doctor: user._id,
    date: { $lt: new Date() },
    status: { $in: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED] }
  };

  const [total, appointments] = await Promise.all([
    Appointment.countDocuments(query),
    Appointment.find(query)
      .populate('pet createdBy')
      .sort({ date: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
  ]);

  res.json({
    success: true,
    data: appointments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

export const confirmAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as IRequestUser;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new NotFoundError('Appointment not found'));
  }

  // Only the assigned doctor can confirm
  if (!appointment.doctor.equals(user._id)) {
    return next(new ForbiddenError('Only the assigned doctor can confirm this appointment'));
  }

  if (appointment.status !== AppointmentStatus.PENDING) {
    return next(new BadRequestError('Only pending appointments can be confirmed'));
  }

  const updated = await Appointment.findByIdAndUpdate(
    id,
    { status: AppointmentStatus.CONFIRMED },
    { new: true }
  ).populate('pet doctor createdBy');

  res.json({
    success: true,
    data: updated
  });
});