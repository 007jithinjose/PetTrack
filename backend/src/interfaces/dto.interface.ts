//File: src/interfaces/dto.interface.ts
export interface LoginDTO {
    email: string;
    password: string;
  }
  
  export interface RegisterPetOwnerDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  }
  
  export interface RegisterDoctorDTO {
    email: string;
    password: string;
    name: string;
    specialization: string;
    hospital: string;
    contactNumber: string;
  }
  
  export interface CreatePetDTO {
    name: string;
    type: string;
    breed: string;
    age: number;
    weight: number;
  }
  
  export interface CreateAppointmentDTO {
    petId: string;
    doctorId: string;
    date: Date;
    reason: string;
    notes?: string;
  }