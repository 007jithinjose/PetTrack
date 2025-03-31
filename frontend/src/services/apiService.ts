//File:src/Services/apiService.ts
import apiClient from './apiClient';
import {
  AuthResponse,
  LoginCredentials,
  PetOwnerRegistration,
  DoctorRegistration,
  Hospital,
  HospitalForRegistration,
  DoctorReference,
  Pet,
  PetInput
} from './interfaces';
import { handleApiError } from '../utils/errorHandler';
import { removeAuthData } from '../utils/auth';

// Generic response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Auth Service
 */
export const authService = {
    registerPetOwner: async (data: PetOwnerRegistration): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await apiClient.post('/auth/register/pet-owner', data);
        if (response.data.data?.token && response.data.data?.user) {
          localStorage.setItem('userData', JSON.stringify({
            token: response.data.data.token,
            _id: response.data.data.user._id,
            role: response.data.data.user.role
          }));
        }
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  
    registerDoctor: async (data: DoctorRegistration): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await apiClient.post('/auth/register/doctor', data);
        if (response.data.data?.token && response.data.data?.user) {
          localStorage.setItem('userData', JSON.stringify({
            token: response.data.data.token,
            _id: response.data.data.user._id,
            role: response.data.data.user.role
          }));
        }
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  
    login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  
    logout: async (): Promise<void> => {
      try {
        removeAuthData();
      } catch (error) {
        throw handleApiError(error);
      }
    }
  };

/**
 * Hospital Service
 */
export const hospitalService = {
  createHospital: async (data: Omit<Hospital, '_id'>): Promise<ApiResponse<Hospital>> => {
    try {
      const response = await apiClient.post('/hospitals', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getHospitals: async (params?: { limit?: number; page?: number }): Promise<ApiResponse<{ results: number; page: number; data: Hospital[] }>> => {
    try {
      const response = await apiClient.get('/hospitals', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getHospitalsForRegistration: async (): Promise<ApiResponse<HospitalForRegistration[]>> => {
    try {
      const response = await apiClient.get('/hospitals/list-for-registration');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getHospital: async (id: string): Promise<ApiResponse<Hospital>> => {
    try {
      const response = await apiClient.get(`/hospitals/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateHospital: async (id: string, data: Partial<Hospital>): Promise<ApiResponse<Hospital>> => {
    try {
      const response = await apiClient.patch(`/hospitals/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteHospital: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.delete(`/hospitals/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getHospitalDoctors: async (id: string): Promise<ApiResponse<DoctorReference[]>> => {
    try {
      const response = await apiClient.get(`/hospitals/${id}/doctors`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addHospitalDoctor: async (hospitalId: string, doctorId: string): Promise<ApiResponse<Hospital>> => {
    try {
      const response = await apiClient.post(`/hospitals/${hospitalId}/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  removeHospitalDoctor: async (hospitalId: string, doctorId: string): Promise<ApiResponse<Hospital>> => {
    try {
      const response = await apiClient.delete(`/hospitals/${hospitalId}/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

/**
 * Pet Service
 */
export const petService = {
  createPet: async (data: PetInput): Promise<ApiResponse<Pet>> => {
    try {
      const response = await apiClient.post('/pets', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPets: async (): Promise<ApiResponse<Pet[]>> => {
    try {
      const response = await apiClient.get('/pets');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPet: async (petId: string): Promise<ApiResponse<Pet>> => {
    try {
      const response = await apiClient.get(`/pets/${petId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updatePet: async (petId: string, data: Partial<PetInput>): Promise<ApiResponse<Pet>> => {
    try {
      const response = await apiClient.patch(`/pets/${petId}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deletePet: async (petId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.delete(`/pets/${petId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

/**
 * Export all services
 */
export default {
  authService,
  hospitalService,
  petService
};