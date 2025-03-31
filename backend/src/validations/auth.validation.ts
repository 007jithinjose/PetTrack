//File: src/validations/auth.validation.ts
import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterPetOwnerValidation:
 *       allOf:
 *         - $ref: '#/components/schemas/PetOwnerRegistration'
 *         - type: object
 *           properties:
 *             password:
 *               minLength: 8
 *               pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
 *               description: Must contain at least 1 uppercase, 1 lowercase, and 1 number
 * 
 *     RegisterDoctorValidation:
 *       allOf:
 *         - $ref: '#/components/schemas/DoctorRegistration'
 *         - type: object
 *           properties:
 *             password:
 *               minLength: 8
 *               pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
 *               description: Must contain at least 1 uppercase, 1 lowercase, and 1 number
 * 
 *     LoginValidation:
 *       allOf:
 *         - $ref: '#/components/schemas/LoginCredentials'
 *         - type: object
 *           properties:
 *             email:
 *               format: email
 */

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const authValidation = {
  login: z.object({
    body: z.object({
      email: z.string().email().trim().toLowerCase(),
      password: z.string().min(8)
    })
  }),
  registerPetOwner: z.object({
    body: z.object({
      email: z.string().email().trim().toLowerCase(),
      password: z.string().regex(passwordRegex, {
        message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
      }),
      firstName: z.string().min(2).max(50).trim(),
      lastName: z.string().min(2).max(50).trim(),
      phone: z.string().min(10).max(15).regex(/^[0-9]+$/),
      address: z.object({
        street: z.string().min(3),
        city: z.string().min(2),
        state: z.string().min(2),
        zipCode: z.string().min(5),
        country: z.string().min(2)
      })
    })
  }),
  registerDoctor: z.object({
    body: z.object({
      email: z.string().email().trim().toLowerCase(),
      password: z.string().regex(passwordRegex, {
        message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
      }),
      name: z.string().min(2).max(100).trim(),
      specialization: z.string().min(2).max(100).trim(),
      hospital: z.string().min(2),
      contactNumber: z.string().min(10).max(15).regex(/^[0-9]+$/)
    })
  })
};