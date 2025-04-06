//File: src/routes/medical.routes.ts
import express from 'express';
import { protect, restrictTo } from '../middlewares/auth';
import {
  createMedicalRecord,
  getPetMedicalRecords,
  suggestTreatments
} from '../controllers/medical.controller';

const router = express.Router();

router.use(protect);
router.use(restrictTo('doctor'));

router.route('/pets/:petId/records')
  .post(createMedicalRecord)
  .get(getPetMedicalRecords);

router.post('/suggestions', suggestTreatments);

export default router;