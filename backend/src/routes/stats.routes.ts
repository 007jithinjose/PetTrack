//File: src/routes/stats.routes.ts
import express from 'express';
import { protect } from '../middlewares/auth';
import {
  getOwnerDashboardStats,
  getDoctorDashboardStats
} from '../controllers/stats.controller';

const router = express.Router();

router.use(protect);

router.get('/owner', getOwnerDashboardStats);
router.get('/doctor', getDoctorDashboardStats);

export default router;