//File: src/interfaces/request.interface.ts
import { Request } from 'express';
import { IUser } from './user.interface';


export interface AuthRequest extends Request {
  user?: IUser;
}

export interface PaginatedRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
    [key: string]: string | undefined;
  };
}

export interface FileUploadRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}