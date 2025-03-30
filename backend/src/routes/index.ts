//File: src/routes/index.ts
import express from 'express';
import authRoutes from './auth.routes';
import petRoutes from './pet.routes';
//import doctorRoutes from './doctor.routes';
//import appointmentRoutes from './appointment.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
//router.use('/doctors', doctorRoutes);
//router.use('/appointments', appointmentRoutes);

export default router;