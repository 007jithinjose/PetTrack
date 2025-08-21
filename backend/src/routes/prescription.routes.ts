// File: src/routes/prescription.routes.ts
import express from 'express';
import { protect, restrictTo } from '../middlewares/auth';
import {
  createPrescription,
  getPetPrescriptions,
  generatePrescriptionPDF,
  getPrescription
} from '../controllers/prescription.controller';
import {
  createPrescriptionSchema,
  getPrescriptionsSchema,
  generatePrescriptionPdfSchema,
  getPrescriptionSchema
} from '../validations/prescription.validation';
import { validate } from '../validations/validate';

const router = express.Router();

router.use(protect);

// Doctor-only routes
router.post(
  '/pets/:petId/prescriptions',
  restrictTo('doctor'),
  validate(createPrescriptionSchema),
  createPrescription
);

// Shared routes
router.get(
  '/pets/:petId/prescriptions',
  restrictTo('doctor', 'petOwner'),
  validate(getPrescriptionsSchema),
  getPetPrescriptions
);

router.get(
  '/:id',
  restrictTo('doctor', 'petOwner'),
  validate(getPrescriptionSchema),
  getPrescription
);

router.get(
  '/:id/pdf',
  restrictTo('doctor', 'petOwner'),
  validate(generatePrescriptionPdfSchema),
  generatePrescriptionPDF
);

export default router;