// File: src/services/apiClient.ts
import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosHeaders,
    RawAxiosRequestHeaders
  } from 'axios';
  import { getToken, removeAuthData } from '../utils/auth';
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  
  // Create Axios instance with default config
  const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    } as RawAxiosRequestHeaders,
    withCredentials: true,
  });
  
  // Request interceptor
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Clear all auth data on unauthorized response
        removeAuthData();
        
        // Redirect to login while preserving the intended path
        const currentPath = window.location.pathname;
        if (currentPath !== '/auth/login') {
          window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
      return Promise.reject(error);
    }
  );
  
  export default apiClient;