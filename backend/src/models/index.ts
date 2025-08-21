import { Model } from 'mongoose';
import User, { PetOwner, Doctor } from './User.model';
import Pet from './Pet.model';
import Appointment from './Appointment.model';
import Vaccination from './Vaccination.model';
import MedicalRecord from './MedicalRecord.model';
import Hospital from './Hospital.model';
import Prescription from './Prescription.model';
import Notification from './Notification.model';

// Export all models
export {
  User,
  PetOwner,
  Doctor,
  Pet,
  Appointment,
  Vaccination,
  MedicalRecord,
  Hospital,
  Prescription,
  Notification
};

// Import all interfaces from the central interfaces index
import type {
  IUser,
  IPetOwner,
  IDoctor,
  IUserMethods,
  UserModel,
  IPet,
  IAppointment,
  IVaccination,
  IMedicalRecord,
  IHospital,
  IPrescription,
  INotification
} from '../interfaces';

// Export interfaces (re-export from interfaces index)
export type {
  IUser,
  IPetOwner,
  IDoctor,
  IUserMethods,
  UserModel,
  IPet,
  IAppointment,
  IVaccination,
  IMedicalRecord,
  IHospital,
  IPrescription,
  INotification
};

// Models interface
export interface IModels {
  User: Model<IUser>;
  PetOwner: Model<IPetOwner>;
  Doctor: Model<IDoctor>;
  Pet: Model<IPet>;
  Appointment: Model<IAppointment>;
  Vaccination: Model<IVaccination>;
  MedicalRecord: Model<IMedicalRecord>;
  Hospital: Model<IHospital>;
  Prescription: Model<IPrescription>;
  Notification: Model<INotification>;
}

const models = {
  User,
  PetOwner,
  Doctor,
  Pet,
  Appointment,
  Vaccination,
  MedicalRecord,
  Hospital,
  Prescription,
  Notification
};

export default models;