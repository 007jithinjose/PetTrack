// File: src/routes/appointment.routes.ts
import express from 'express';
import { protect } from '../middlewares/auth';
import { restrictTo } from '../middlewares/auth';
import { UserRole } from '../interfaces/user.interface';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
  rescheduleAppointment
} from '../controllers/appointment.controller';
import {validate} from '../validations/validate';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  rescheduleAppointmentSchema,
} from '../validations/appointment.validation';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(
    restrictTo(UserRole.PET_OWNER),
    validate(createAppointmentSchema),
    createAppointment
  )
  .get(getAppointments);

router.route('/:id')
  .get(getAppointmentById)
  .patch(
    validate(updateAppointmentSchema),
    updateAppointment
  );

router.patch('/:id/cancel', cancelAppointment);
router.patch('/:id/reschedule', 
  validate(rescheduleAppointmentSchema),
  rescheduleAppointment
);

export default router;