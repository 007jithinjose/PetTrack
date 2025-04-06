//File: src/services/notification.service.ts
import Notification from '../models/Notification.model';
import { NotificationType } from '../interfaces/notification.interface';

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  relatedEntity?: string
) => {
  return Notification.create({
    user: userId,
    type,
    title,
    message,
    relatedEntity,
    read: false
  });
};

export const sendAppointmentReminder = async (appointment: any) => {
  // Send reminder 24 hours before appointment
  await createNotification(
    appointment.pet.owner,
    NotificationType.APPOINTMENT,
    'Appointment Reminder',
    `You have an appointment with ${appointment.doctor.name} tomorrow at ${appointment.date}`,
    appointment._id
  );
};

export const sendVaccinationReminder = async (vaccination: any) => {
  // Send reminder 1 week before due date
  await createNotification(
    vaccination.pet.owner,
    NotificationType.VACCINATION,
    'Vaccination Due',
    `${vaccination.name} is due for ${vaccination.pet.name} on ${vaccination.nextDueDate}`,
    vaccination._id
  );
};