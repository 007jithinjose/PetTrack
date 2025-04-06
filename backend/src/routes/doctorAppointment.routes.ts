// File: src/routes/doctorAppointment.routes.ts
import express from 'express';
import { protect } from '../middlewares/auth';
import { restrictTo } from '../middlewares/auth';
import { UserRole } from '../interfaces/user.interface';
import {
  getDoctorAppointments,
  confirmAppointment,
  getUpcomingAppointments,
  getPastAppointments,
  completeAppointment
} from '../controllers/appointment.controller';
import {validate} from '../validations/validate';
import {
  completeAppointmentSchema,
  confirmAppointmentSchema
} from '../validations/appointment.validation';


const router = express.Router();

router.use(protect);
router.use(restrictTo(UserRole.DOCTOR));

router.get('/my-appointments', getDoctorAppointments);
router.get('/upcoming', getUpcomingAppointments);
router.get('/past', getPastAppointments);
router.patch('/:id/confirm',validate(confirmAppointmentSchema), confirmAppointment);
router.patch('/:id/complete', 
  validate(completeAppointmentSchema),
  completeAppointment
);
export default router;