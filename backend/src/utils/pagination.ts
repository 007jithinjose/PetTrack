// File: src/utils/pagination.ts
import { Request } from 'express';

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: PaginationOptions;
}

export const getPaginationParams = (req: Request, defaultLimit = 10, maxLimit = 100) => {
  const page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || defaultLimit;
  
  // Ensure limit doesn't exceed maximum
  limit = Math.min(limit, maxLimit);
  
  return { page, limit };
};

export const createPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};