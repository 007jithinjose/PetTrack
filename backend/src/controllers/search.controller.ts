// File: src/controllers/search.controller.ts
import { Request, Response } from 'express';
import User from '../models/User.model';
import Hospital from '../models/Hospital.model';
import { catchAsync } from '../utils/catchAsync';
import { Types } from 'mongoose';
import { IDoctor, IHospital } from '../interfaces';

interface PopulatedDoctor extends Omit<IDoctor, 'hospital'> {
  hospital: IHospital | Types.ObjectId;
}

export const searchDoctors = catchAsync(async (req: Request, res: Response) => {
  const { specialty, location } = req.query;
  
  let query: any = { role: 'doctor' };
  if (specialty) query['specialization'] = new RegExp(specialty as string, 'i');
  
  const doctors = await User.find(query)
    .populate<{ hospital: IHospital }>('hospital', 'name address')
    .lean<PopulatedDoctor[]>();
  
  let filteredDoctors = doctors;
  if (location) {
    const locationRegex = new RegExp(location as string, 'i');
    filteredDoctors = doctors.filter(d => {
      const hospital = d.hospital as IHospital;
      return hospital?.address?.city?.match(locationRegex);
    });
  }
  
  res.json({
    success: true,
    count: filteredDoctors.length,
    data: filteredDoctors
  });
});

export const searchHospitals = catchAsync(async (req: Request, res: Response) => {
  const { service, location } = req.query;
  
  let query: any = {};
  if (service) query['services'] = new RegExp(service as string, 'i');
  if (location) query['address.city'] = new RegExp(location as string, 'i');
  
  const hospitals = await Hospital.find(query)
    .populate<{ doctors: IDoctor[] }>('doctors', 'name specialization')
    .lean<IHospital[]>();
  
  res.json({
    success: true,
    count: hospitals.length,
    data: hospitals
  });
});