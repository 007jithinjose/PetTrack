//File: src/utils/errorHandler.ts
import { AxiosError } from 'axios';

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Handle HTTP errors
      return error.response.data?.message || error.message;
    }
    if (error.request) {
      // Handle network errors
      return 'Network error - please check your connection';
    }
  }
  return 'An unexpected error occurred';
};