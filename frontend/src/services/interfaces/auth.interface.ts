// File: src/services/interfaces/auth.interface.ts
export interface User {
  image?: string | undefined;
  _id: string;
  email: string;
  role: 'petOwner' | 'doctor' | 'admin';
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Doctor-specific fields
  specialization?: string;
  hospital?: string;
  contactNumber?: string;
  // Pet owner-specific fields
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pets?: string[]; // Array of pet IDs
}

export interface AuthResponse {
  user: User;
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