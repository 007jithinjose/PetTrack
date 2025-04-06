//File: src/routes/index.ts
import express from 'express';
import authRoutes from './auth.routes';
import petRoutes from './pet.routes';
import hospitalRoutes from './hospital.routes';
import medicalRoutes from './medical.routes';
import appointmentRoutes from './appointment.routes';
import vaccinationRoutes from './vaccination.routes';
import prescriptionRoutes from './prescription.routes';
import doctorRoutes from './doctor.routes';
import searchRoutes from './search.routes';
import statsRoutes from './stats.routes';
import doctorAppointmentRoutes from './doctorAppointment.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/doctor', doctorAppointmentRoutes);
router.use('/medical', medicalRoutes);
router.use('/vaccinations', vaccinationRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/doctors', doctorRoutes);
router.use('/search', searchRoutes);
router.use('/stats', statsRoutes);

export default router;