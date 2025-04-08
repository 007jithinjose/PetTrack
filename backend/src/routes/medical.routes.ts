// File: src/routes/medical.routes.ts
import express from 'express';
import { protect, restrictTo } from '../middlewares/auth';
import {
  createMedicalRecord,
  getPetMedicalRecords,
  suggestTreatments,
  getMedicalRecord,
  getAppointmentRecords,
  updateMedicalRecord
} from '../controllers/medical.controller';
import {
  createMedicalRecordSchema,
  suggestTreatmentsSchema,
  getMedicalRecordsSchema,
  getMedicalRecordSchema,
  getAppointmentRecordsSchema,
  updateMedicalRecordSchema
} from '../validations/medical.validation';
import { validate } from '../validations/validate';

const router = express.Router();

router.use(protect);

// Doctor-only routes
router.post(
  '/pets/:petId/records',
  restrictTo('doctor'),
  validate(createMedicalRecordSchema),
  createMedicalRecord
);

router.post(
  '/suggestions',
  restrictTo('doctor'),
  validate(suggestTreatmentsSchema),
  suggestTreatments
);

router.patch(
  '/records/:id',
  restrictTo('doctor'),
  validate(updateMedicalRecordSchema),
  updateMedicalRecord
);

// Shared routes (doctors and pet owners)
router.get(
  '/pets/:petId/records',
  restrictTo('doctor', 'petOwner'),
  validate(getMedicalRecordsSchema),
  getPetMedicalRecords
);

router.get(
  '/records/:id',
  restrictTo('doctor', 'petOwner'),
  validate(getMedicalRecordSchema),
  getMedicalRecord
);

router.get(
  '/appointments/:appointmentId/records',
  restrictTo('doctor', 'petOwner'),
  validate(getAppointmentRecordsSchema),
  getAppointmentRecords
);

export default router;