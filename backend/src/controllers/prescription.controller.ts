// File: src/controllers/prescription.controller.ts
import { Request, Response } from 'express';
import Prescription from '../models/Prescription.model';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../errors/ApiError';
import { Types } from 'mongoose';
import { IRequestUser } from '../interfaces';

interface AuthenticatedRequest extends Request {
  user?: IRequestUser;
}

export const createPrescription = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { petId } = req.params;
  
  if (!req.user?._id) {
    throw new ApiError(401, 'Not authenticated');
  }

  const prescription = await Prescription.create({
    ...req.body,
    pet: petId,
    doctor: req.user._id
  });
  
  res.status(201).json(prescription);
});

export const getPetPrescriptions = catchAsync(async (req: Request, res: Response) => {
  const { petId } = req.params;
  
  if (!Types.ObjectId.isValid(petId)) {
    throw new ApiError(400, 'Invalid pet ID');
  }

  const prescriptions = await Prescription.find({ pet: petId })
    .populate('doctor', 'name')
    .populate('pet', 'name')
    .sort({ date: -1 });
    
  res.json(prescriptions);
});

export const generatePrescriptionPDF = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid prescription ID');
  }

  const prescription = await Prescription.findById(id)
    .populate<{ doctor: { _id: Types.ObjectId, name: string }, pet: { _id: Types.ObjectId, name: string } }>([
      { path: 'doctor', select: 'name' },
      { path: 'pet', select: 'name' }
    ]);

  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  // Type guard to ensure populated fields exist
  if (!prescription.doctor || !prescription.pet || typeof prescription.doctor.name !== 'string' || typeof prescription.pet.name !== 'string') {
    throw new ApiError(500, 'Failed to populate prescription data');
  }

  // In a real app, you would use a PDF generation library like pdfkit
  // This is a simplified version
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