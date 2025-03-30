//File: src/interfaces/service.interface.ts
export interface IServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    statusCode?: number;
  }
  
  export interface IPaginatedResult<T> {
    data: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }