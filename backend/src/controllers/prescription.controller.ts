//File: src/controllers/prescription.controller.ts
import { Request, Response } from 'express';
import Prescription from '../models/Prescription.model';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../errors/ApiError';
import { Types } from 'mongoose';
import { IRequestUser } from '../interfaces';
import Appointment from '../models/Appointment.model';
import { CreatePrescriptionInput } from '../validations/prescription.validation';
import { Pet } from '../models';

interface AuthenticatedRequest extends Request {
  user?: IRequestUser;
}

export const createPrescription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // Proper type casting
  const { body } = req as unknown as CreatePrescriptionInput;
  const { petId } = req.params;
  const doctorId = req.user?._id;
  
  if (!doctorId) {
    throw new ApiError(401, 'Not authenticated');
  }

  // Check if there's a confirmed appointment for this pet-doctor pair
  const appointment = await Appointment.findOne({
    pet: petId,
    doctor: doctorId,
    status: 'confirmed',
    date: { $lte: new Date() }
  });

  if (!appointment) {
    throw new ApiError(400, 'No confirmed appointment found for this pet and doctor');
  }

  const prescription = await Prescription.create({
    ...body,
    pet: petId,
    doctor: doctorId,
    appointment: appointment._id
  });

  res.status(201).json(prescription);
});

export const getPetPrescriptions = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { petId } = req.params;
  const { limit, page } = req.query as { limit?: string; page?: string };
  const userId = req.user?._id;
  
  // Verify the pet belongs to the user (for pet owners)
  if (req.user?.role === 'petOwner') {
    const pet = await Pet.findById(petId);
    if (!pet || pet.owner.toString() !== userId?.toString()) {
      throw new ApiError(403, 'You can only view prescriptions for your own pets');
    }
  }

  const parsedLimit = limit ? parseInt(limit) : 10;
  const parsedPage = page ? parseInt(page) : 1;
  const skip = (parsedPage - 1) * parsedLimit;

  const [prescriptions, total] = await Promise.all([
    Prescription.find({ pet: petId })
      .populate('doctor', 'name')
      .populate('pet', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit),
    Prescription.countDocuments({ pet: petId })
  ]);

  res.json({
    data: prescriptions,
    meta: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit)
    }
  });
});

export const generatePrescriptionPDF = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const prescription = await Prescription.findById(id)
    .populate<{ doctor: { _id: Types.ObjectId, name: string }, pet: { _id: Types.ObjectId, name: string } }>([
      { path: 'doctor', select: 'name' },
      { path: 'pet', select: 'name' }
    ]);

  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  // Verify access
  if (req.user?.role === 'petOwner') {
    const pet = await Pet.findById(prescription.pet);
    if (!pet || pet.owner.toString() !== userId?.toString()) {
      throw new ApiError(403, 'You can only view prescriptions for your own pets');
    }
  } else if (req.user?.role === 'doctor' && prescription.doctor._id.toString() !== userId?.toString()) {
    throw new ApiError(403, 'You can only view your own prescriptions');
  }

  // In a real app, you would use a PDF generation library like pdfkit
  const prescriptionText = `
    PRESCRIPTION
    Date: ${prescription.date.toISOString().split('T')[0]}
    Pet: ${prescription.pet.name}
    Doctor: ${prescription.doctor.name}
    
    Medications:
    ${prescription.medications.map(med => `
      - ${med.name}: ${med.dosage}, ${med.frequency} for ${med.duration}
    `).join('')}
    
    Instructions: ${prescription.instructions || 'None'}
  `;
  
  res.setHeader('Content-Type', 'text/plain');
  res.send(prescriptionText);
});

export const getPrescription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const prescription = await Prescription.findById(id)
    .populate('doctor', 'name')
    .populate('pet', 'name')
    .populate('appointment', 'date reason');

  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  // Verify access
  if (req.user?.role === 'petOwner') {
    const pet = await Pet.findById(prescription.pet);
    if (!pet || pet.owner.toString() !== userId?.toString()) {
      throw new ApiError(403, 'You can only view prescriptions for your own pets');
    }
  } else if (req.user?.role === 'doctor' && prescription.doctor._id.toString() !== userId?.toString()) {
    throw new ApiError(403, 'You can only view your own prescriptions');
  }

  res.json(prescription);
});