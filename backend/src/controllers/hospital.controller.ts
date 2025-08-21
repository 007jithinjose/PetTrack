// File: src/controllers/hospital.controller.ts
import { Request, Response } from 'express';
import Hospital from '../models/Hospital.model';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../errors/ApiError';
import { Types } from 'mongoose';

/**
 * @swagger
 * tags:
 *   name: Hospitals
 *   description: Hospital management endpoints
 */

/**
 * @swagger
 * /hospitals:
 *   post:
 *     summary: Create a new hospital
 *     tags: [Hospitals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hospital'
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Validation error
 */
export const createHospital = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.create(req.body);
  res.status(201).json({
    status: 'success',
    data: hospital
  });
});

/**
 * @swagger
 * /hospitals:
 *   get:
 *     summary: Get all hospitals with pagination
 *     tags: [Hospitals]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limit number of hospitals per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hospital'
 */
export const getHospitals = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * limit;

  const [hospitals, total] = await Promise.all([
    Hospital.find()
      .limit(limit)
      .skip(skip)
      .sort('name'),
    Hospital.countDocuments()
  ]);

  res.status(200).json({
    status: 'success',
    results: hospitals.length,
    total,
    data: hospitals
  });
});

/**
 * @swagger
 * /hospitals/list-for-registration:
 *   get:
 *     summary: Get simplified hospital list for registration
 *     tags: [Hospitals]
 *     responses:
 *       200:
 *         description: List of hospitals (id and name only)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HospitalForRegistration'
 */
export const getHospitalsForRegistration = catchAsync(async (req: Request, res: Response) => {
  const hospitals = await Hospital.find().select('_id name').sort('name');
  res.status(200).json({
    status: 'success',
    results: hospitals.length,
    data: hospitals
  });
});

/**
 * @swagger
 * /hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Hospital data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital not found
 */
export const getHospital = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }
  res.status(200).json({
    status: 'success',
    data: hospital
  });
});

/**
 * @swagger
 * /hospitals/{id}:
 *   patch:
 *     summary: Update hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hospital'
 *     responses:
 *       200:
 *         description: Updated hospital
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital not found
 */
export const updateHospital = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }
  res.status(200).json({
    status: 'success',
    data: hospital
  });
});

/**
 * @swagger
 * /hospitals/{id}:
 *   delete:
 *     summary: Delete hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Hospital deleted
 *       404:
 *         description: Hospital not found
 */
export const deleteHospital = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findByIdAndDelete(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * @swagger
 * /hospitals/{id}/doctors:
 *   get:
 *     summary: Get all doctors for a hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoctorReference'
 *       404:
 *         description: Hospital not found
 */
export const getHospitalDoctors = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findById(req.params.id)
    .populate({
      path: 'doctors',
      select: 'name email specialization',
      match: { role: 'doctor' } // Ensure we only get doctor role users
    });

  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }
  
  // Filter out null values in case some references are invalid
  const validDoctors = hospital.doctors?.filter(doc => doc !== null) || [];
  
  res.status(200).json({
    status: 'success',
    results: validDoctors.length,
    data: validDoctors
  });
});
/**
 * @swagger
 * /hospitals/{id}/doctors/{doctorId}:
 *   post:
 *     summary: Add doctor to hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital or doctor not found
 */
export const addHospitalDoctor = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  const doctorId = new Types.ObjectId(req.params.doctorId);
  await hospital.addDoctor(doctorId);
  
  const updatedHospital = await Hospital.findById(hospital._id)
    .populate({
      path: 'doctors',
      select: 'name email specialization'
    });

  res.status(200).json({
    status: 'success',
    data: updatedHospital
  });
});

/**
 * @swagger
 * /hospitals/{id}/doctors/{doctorId}:
 *   delete:
 *     summary: Remove doctor from hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital or doctor not found
 */
export const removeHospitalDoctor = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  const doctorId = new Types.ObjectId(req.params.doctorId);
  await hospital.removeDoctor(doctorId);
  
  const updatedHospital = await Hospital.findById(hospital._id)
    .populate({
      path: 'doctors',
      select: 'name email specialization'
    });

  res.status(200).json({
    status: 'success',
    data: updatedHospital
  });
});