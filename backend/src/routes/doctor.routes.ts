// File: src/routes/doctor.routes.ts
import express from 'express';
import { protect, restrictTo } from '../middlewares/auth';
import {
  getPatients,
  getMedicalHistory,
  getSuggestions,
  getDoctorProfile
} from '../controllers/doctor.controller';

const router = express.Router();

router.use(protect);
router.use(restrictTo('doctor'));

// Patient management
router.get('/patients', getPatients);
router.get('/patients/:petId/medical-history', getMedicalHistory);

// Suggestions - changed to POST since we're sending body data
router.post('/suggestions', getSuggestions);

// Profile
router.get('/profile', getDoctorProfile);

export default router;