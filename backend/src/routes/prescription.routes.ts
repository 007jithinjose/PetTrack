//File: src/routes/prescription.routes.ts
import express from 'express';
import { protect } from '../middlewares/auth';
import {
  createPrescription,
  getPetPrescriptions,
  generatePrescriptionPDF
} from '../controllers/prescription.controller';

const router = express.Router();

router.use(protect);

router.route('/pets/:petId/prescriptions')
  .post(createPrescription)
  .get(getPetPrescriptions);

router.get('/:id/pdf', generatePrescriptionPDF);

export default router;