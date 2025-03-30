// File: src/types/express-extensions.d.ts
import { JwtPayload } from '../utils/jwt';
import { IPetOwner, IDoctor } from '../interfaces';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload & (IPetOwner | IDoctor);
  }
}