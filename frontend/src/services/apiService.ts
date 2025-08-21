import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { handleApiError } from '../utils/errorHandler';
import {
  setAuthData,
  removeAuthData,
  getUserData,
  getToken,
  isAuthenticated,
  hasRole
} from '../utils/auth';
import {
  AuthResponse,
  LoginCredentials,
  PetOwnerRegistration,
  DoctorRegistration,
  User
} from './interfaces/auth.interface';
import {
  Hospital,
  HospitalForRegistration,
  DoctorReference,
  HospitalsResponse
} from './interfaces/hospital.interface';
import { Pet, PetInput } from './interfaces/pet.interface';
import {
  Appointment,
  CreateAppointmentDTO,
  PaginatedAppointments,
} from './interfaces/appointment.interface';
import qs from 'qs';
import { CreateMedicalRecordInput, MedicalRecordResponse, TreatmentSuggestionResponse } from './interfaces/medical.interface'; // Ensure this path is correct
import { PrescriptionResponse, CreatePrescriptionInput } from './interfaces';

// Base response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject auth token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 unauthorized
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthData();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?sessionExpired=true';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Auth Service
 */
export const authService = {
  registerPetOwner: async (data: PetOwnerRegistration): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post('/auth/register/pet-owner', data);
      if (response.data.data?.token && response.data.data?.user) {
        setAuthData({
          token: response.data.data.token,
          _id: response.data.data.user._id,
          role: response.data.data.user.role,
          email: response.data.data.user.email,
          name: response.data.data.user.name
        });
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
        setAuthData({
          token: response.data.data.token,
          _id: response.data.data.user._id,
          role: response.data.data.user.role,
          email: response.data.data.user.email,
          name: response.data.data.user.name
        });
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.data?.token && response.data.data?.user) {
        setAuthData({
          token: response.data.data.token,
          _id: response.data.data.user._id,
          role: response.data.data.user.role,
          email: response.data.data.user.email,
          name: response.data.data.user.name
        });
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      removeAuthData();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } 
  },

  getCurrentUser: (): User | null => {
    const data = getUserData();
    return data ? {
      _id: data._id,
      role: data.role,
      email: data.email || '',
      name: data.name || ''
    } : null;
  },

  isAuthenticated,
  hasRole
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

  getHospitals: async (params?: { 
    limit?: number; 
    page?: number;
    search?: string;
  }): Promise<ApiResponse<HospitalsResponse>> => {
    try {
      const response = await apiClient.get('/hospitals', { params });
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
      console.log('API Response:', response); // Debug log
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getHospitalsForRegistration: async (): Promise<ApiResponse<HospitalForRegistration[]>> => {
    try {
      const response = await apiClient.get('/hospitals/list-for-registration');
      console.log('API Response:', response); // Debug log
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

  getPets: async (params?: { ownerId?: string }): Promise<ApiResponse<Pet[]>> => {
    try {
      const response = await apiClient.get('/pets', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPet: async (id: string): Promise<ApiResponse<Pet>> => {
    try {
      const response = await apiClient.get(`/pets/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updatePet: async (id: string, data: Partial<PetInput>): Promise<ApiResponse<Pet>> => {
    try {
      const response = await apiClient.patch(`/pets/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deletePet: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.delete(`/pets/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPetMedicalRecords: async (petId: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get(`/pets/${petId}/medical-records`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

/**
 * Appointment Service
 */
export const appointmentService = {
  createAppointment: async (data: CreateAppointmentDTO): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiClient.post('/appointments', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAppointments: async (params?: {
    petId?: string | string[];
    doctorId?: string;
    startDate?: string;
    endDate?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedAppointments>> => {
    try {
      // Convert petId to array if it's a string
      const processedParams = {
        ...params,
        petId: params?.petId 
          ? Array.isArray(params.petId) 
            ? params.petId 
            : [params.petId]
          : undefined
      };
      
      // Filter out undefined params
      const filteredParams = Object.fromEntries(
        Object.entries(processedParams).filter(([_, v]) => v !== undefined)
      );
      
      const response = await apiClient.get('/appointments', { 
        params: filteredParams,
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        }
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAppointmentById: async (id: string): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiClient.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateAppointment: async (
    id: string, 
    data: Partial<CreateAppointmentDTO>
  ): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiClient.patch(`/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  cancelAppointment: async (id: string): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiClient.patch(`/appointments/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  rescheduleAppointment: async (
    id: string,
    newDate: Date | string
  ): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiClient.patch(
        `/appointments/${id}/reschedule`,
        { date: newDate }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  completeAppointment: async (
    id: string,
    notes?: string
  ): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiClient.patch(
        `/appointments/${id}/complete`,
        { notes }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Doctor-specific appointment services
  getDoctorAppointments: async (params?: {
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedAppointments>> => {
    try {
      const response = await apiClient.get('/doctor/my-appointments', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUpcomingAppointments: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedAppointments>> => {
    try {
      const response = await apiClient.get('/doctor/upcoming', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPastAppointments: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedAppointments>> => {
    try {
      const response = await apiClient.get('/doctor/past', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  confirmAppointment: async (id: string): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiClient.patch(`/doctor/${id}/confirm`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
/**
 * Pet Owner Service
 */
export const petOwnerService = {
  getMyPets: async (ownerId: string): Promise<ApiResponse<Pet[]>> => {
    try {
      const response = await apiClient.get(`/pet-owners/${ownerId}/pets`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

/**
 * Medical Records Service
 */
export const medicalService = {
  createMedicalRecord: async (
    petId: string, 
    data: CreateMedicalRecordInput
  ): Promise<ApiResponse<MedicalRecordResponse>> => {
    try {
      const response = await apiClient.post(`/medical/pets/${petId}/records`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPetMedicalRecords: async (
    petId: string,
    params?: { 
      limit?: number;
      page?: number;
    }
  ): Promise<ApiResponse<{
    data: MedicalRecordResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }>> => {
    try {
      const response = await apiClient.get(`/medical/pets/${petId}/records`, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  suggestTreatments: async (
    symptoms: string[]
  ): Promise<ApiResponse<TreatmentSuggestionResponse>> => {
    try {
      const response = await apiClient.post('/medical/suggestions', { symptoms });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMedicalRecord: async (
    id: string
  ): Promise<ApiResponse<MedicalRecordResponse>> => {
    try {
      const response = await apiClient.get(`/medical/records/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateMedicalRecord: async (
    id: string,
    data: Partial<CreateMedicalRecordInput>
  ): Promise<ApiResponse<MedicalRecordResponse>> => {
    try {
      const response = await apiClient.patch(`/medical/records/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAppointmentRecords: async (
    appointmentId: string
  ): Promise<ApiResponse<MedicalRecordResponse[]>> => {
    try {
      const response = await apiClient.get(`/medical/appointments/${appointmentId}/records`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

/**
 * Prescription Service
 */
export const prescriptionService = {
  getPetPrescriptions: (petId: string): Promise<AxiosResponse<PaginatedResponse<PrescriptionResponse>>> =>
    apiClient.get(`/prescriptions/pets/${petId}/prescriptions`),
    
  createPrescription: (petId: string, data: CreatePrescriptionInput): Promise<AxiosResponse<PrescriptionResponse>> =>
    apiClient.post(`/prescriptions/pets/${petId}/prescriptions`, data),
    
  generatePrescriptionPDF: (id: string): Promise<AxiosResponse<Blob>> =>
    apiClient.get(`/prescriptions/${id}/pdf`, { responseType: 'blob' }),
    
  getPrescription: (id: string): Promise<AxiosResponse<PrescriptionResponse>> =>
    apiClient.get(`/prescriptions/${id}`)
};


// Add PaginatedResponse interface
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
// Export all services
export default {
  authService,
  hospitalService,
  petService,
  appointmentService,
  petOwnerService,
  medicalService,
  prescriptionService,
};