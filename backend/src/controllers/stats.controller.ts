// File: src/controllers/stats.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import { Prescription, Vaccination,Appointment,Pet} from '../models';
import { Types } from 'mongoose';
import { IRequestUser } from '../interfaces/request.interface';
import { ApiError } from '../errors/ApiError';

interface AuthenticatedRequest extends Request {
  user: IRequestUser & {
    _id: Types.ObjectId;
    pets?: Types.ObjectId[];
  };
}

export const getOwnerDashboardStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.pets) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User information is missing');
  }

  const [petCount, upcomingAppointments, vaccinationDue] = await Promise.all([
    Pet.countDocuments({ owner: req.user._id }),
    Appointment.countDocuments({
      pet: { $in: req.user.pets },
      date: { $gte: new Date() },
      status: 'confirmed'
    }),
    Vaccination.countDocuments({
      pet: { $in: req.user.pets },
      nextDueDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // Next 30 days
    })
  ]);
  
  res.status(httpStatus.OK).json({ 
    success: true,
    data: { 
      petCount, 
      upcomingAppointments, 
      vaccinationDue 
    }
  });
});

export const getDoctorDashboardStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [appointmentsToday, totalPatients, prescriptionsIssued] = await Promise.all([
    Appointment.countDocuments({
      doctor: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      status: 'confirmed'
    }),
    Appointment.distinct('pet', { doctor: req.user._id }).then(ids => ids.length),
    Prescription.countDocuments({ doctor: req.user._id })
  ]);
  
  res.status(httpStatus.OK).json({ 
    success: true,
    data: { 
      appointmentsToday, 
      totalPatients, 
      prescriptionsIssued 
    }
  });
});