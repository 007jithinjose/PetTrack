//File: src/services/interfaces/hospital.interface.ts
export interface Hospital {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactNumber: string;
  email?: string;
  services?: string[];
  doctors?: string[];
}

export interface HospitalForRegistration {
  _id: string;
  name: string;
}

export interface DoctorReference {
  _id: string;
  name: string;
  email: string;
  specialization: string;
}

export interface HospitalsResponse {
  status: string;
  results: number;
  total: number;
  data: Hospital[];
}