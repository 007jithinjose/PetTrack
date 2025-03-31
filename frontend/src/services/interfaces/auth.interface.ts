//File: src/services/interfaces/auth.interface.ts
export interface AuthResponse {
    user: {
      _id: string;
      email: string;
      role: 'petOwner' | 'doctor';
      [key: string]: any;
    };
    token: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface PetOwnerRegistration {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }
  
  export interface DoctorRegistration {
    email: string;
    password: string;
    name: string;
    specialization: string;
    hospital?: string;
    contactNumber: string;
  }