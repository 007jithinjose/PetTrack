//File: src/controllers/hospital.controller.ts
import { Request, Response } from 'express';
import Hospital from '../models/Hospital.model';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../errors/ApiError';
import { Types } from 'mongoose';

/**
 * @swagger
 * tags:
 * name: Hospitals
 * description: Hospital management endpoints
 */

/**
 * @swagger
 * /hospitals:
 * post:
 * summary: Create a new hospital
 * tags: [Hospitals]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Hospital'
 * example:
 * $ref: '#/components/examples/HospitalRequest'
 * responses:
 * 201:
 * description: Hospital created successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Hospital'
 * example:
 * $ref: '#/components/examples/HospitalResponse'
 * 400:
 * description: Validation error
 * content:
 * application/json:
 * example:
 * $ref: '#/components/examples/HospitalError'
 */
export const createHospital = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.create(req.body);
  res.status(201).json(hospital);
});

/**
 * @swagger
 * /hospitals:
 * get:
 * summary: Get all hospitals with pagination
 * tags: [Hospitals]
 * parameters:
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * default: 10
 * description: Limit number of hospitals per page
 * - in: query
 * name: page
 * schema:
 * type: integer
 * default: 1
 * description: Page number
 * responses:
 * 200:
 * description: List of hospitals
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * results:
 * type: integer
 * description: Number of results on the current page.
 * page:
 * type: integer
 * description: Current page number.
 * data:
 * type: array
 * items:
 * $ref: '#/components/schemas/Hospital'
 * example:
 * results: 2
 * page: 1
 * data:
 * - $ref: '#/components/examples/HospitalResponse'
 * - name: "Another Hospital"
 * address:
 * street: "789 Health St"
 * city: "Boston"
 * state: "MA"
 * zipCode: "02115"
 * country: "USA"
 * contactNumber: "617-555-1234"
 * email: "info@anotherhospital.com"
 * services: ["Pediatrics", "Surgery"]
 */
export const getHospitals = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;

  const hospitals = await Hospital.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .sort('name');

  res.status(200).json({
    results: hospitals.length,
    page,
    data: hospitals
  });
});

/**
 * @swagger
 * /hospitals/list-for-registration:
 * get:
 * summary: Get a simplified list of hospitals for doctor registration
 * tags: [Hospitals]
 * responses:
 * 200:
 * description: A list of hospital IDs and names
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/HospitalForDoctorRegistration'
 * example:
 * - _id: "507f1f77bcf86cd799439011"
 * name: "City Veterinary Hospital"
 * - _id: "507f1f77bcf86cd799439012"
 * name: "Metropolitan Animal Hospital"
 */
export const getHospitalsForRegistration = catchAsync(async (req: Request, res: Response) => {
  const hospitals = await Hospital.find().select('_id name').sort('name');
  res.status(200).json(hospitals);
});

/**
 * @swagger
 * /hospitals/{id}:
 * get:
 * summary: Get hospital by ID
 * tags: [Hospitals]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Hospital ID
 * responses:
 * 200:
 * description: Hospital data
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Hospital'
 * example:
 * $ref: '#/components/examples/HospitalResponse'
 * 404:
 * description: Hospital not found
 * content:
 * application/json:
 * example:
 * message: "Hospital not found"
 */
export const getHospital = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }
  res.status(200).json(hospital);
});

/**
 * @swagger
 * /hospitals/{id}:
 * patch:
 * summary: Update hospital
 * tags: [Hospitals]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Hospital ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Hospital'
 * example:
 * name: "Updated Hospital Name"
 * services: ["New Service 1", "New Service 2"]
 * responses:
 * 200:
 * description: Updated hospital data
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Hospital'
 * 400:
 * description: Validation error
 * 404:
 * description: Hospital not found
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
  res.status(200).json(hospital);
});

/**
 * @swagger
 * /hospitals/{id}:
 * delete:
 * summary: Delete hospital
 * tags: [Hospitals]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Hospital ID
 * responses:
 * 204:
 * description: Hospital deleted successfully
 * 404:
 * description: Hospital not found
 */
export const deleteHospital = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findByIdAndDelete(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }
  res.status(204).json({ status: 'success' });
});

/**
 * @swagger
 * /hospitals/{id}/doctors:
 * get:
 * summary: Get all doctors for a hospital
 * tags: [Hospitals]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Hospital ID
 * responses:
 * 200:
 * description: List of doctors
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/DoctorReference'
 * example:
 * - _id: "507f1f77bcf86cd799439012"
 * name: "Dr. Sarah Johnson"
 * email: "s.johnson@hospital.com"
 * specialization: "Cardiology"
 * - _id: "507f1f77bcf86cd799439013"
 * name: "Dr. Michael Chen"
 * email: "m.chen@hospital.com"
 * specialization: "Neurology"
 * 404:
 * description: Hospital not found
 */
export const getHospitalDoctors = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findById(req.params.id)
    .populate({
      path: 'doctors',
      select: 'name email specialization'
    });

  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }
  res.status(200).json(hospital.doctors);
});

/**
 * @swagger
 * /hospitals/{id}/doctors/{doctorId}:
 * post:
 * summary: Add doctor to hospital
 * tags: [Hospitals]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Hospital ID
 * - in: path
 * name: doctorId
 * required: true
 * schema:
 * type: string
 * description: Doctor ID
 * responses:
 * 200:
 * description: Doctor added successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Hospital'
 * 404:
 * description: Hospital or doctor not found
 */
export const addHospitalDoctor = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  await hospital.addDoctor(new Types.ObjectId(req.params.doctorId));
  res.status(200).json(hospital);
});

/**
 * @swagger
 * /hospitals/{id}/doctors/{doctorId}:
 * delete:
 * summary: Remove doctor from hospital
 * tags: [Hospitals]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Hospital ID
 * - in: path
 * name: doctorId
 * required: true
 * schema:
 * type: string
 * description: Doctor ID
 * responses:
 * 200:
 * description: Doctor removed successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Hospital'
 * 404:
 * description: Hospital or doctor not found
 */
export const removeHospitalDoctor = catchAsync(async (req: Request, res: Response) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  await hospital.removeDoctor(new Types.ObjectId(req.params.doctorId));
  res.status(200).json(hospital);
});