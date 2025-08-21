//File: src/validations/hospital.validation.ts
import { z } from 'zod';

/**
 * @swagger
 * components:
 * schemas:
 * HospitalInput:
 * type: object
 * required:
 * - name
 * - address
 * - contactNumber
 * - email
 * properties:
 * name:
 * type: string
 * example: "City Veterinary Hospital"
 * address:
 * $ref: '#/components/schemas/HospitalAddress'
 * contactNumber:
 * type: string
 * example: "555-123-4567"
 * email:
 * type: string
 * format: email
 * example: "info@cityvet.com"
 * services:
 * type: array
 * items:
 * type: string
 * example: ["Emergency", "Surgery", "Dental"]
 */

const addressSchema = z.object({
  street: z.string().min(2, "Street must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters")
});

export const hospitalValidation = {
  createHospital: z.object({
    body: z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      address: addressSchema,
      contactNumber: z.string().min(10, "Contact number must be at least 10 characters"),
      email: z.string().email("Invalid email format"),
      services: z.array(z.string().min(2, "Service must be at least 2 characters")).optional()
    })
  }),
  updateHospital: z.object({
    body: z.object({
      name: z.string().min(2, "Name must be at least 2 characters").optional(),
      address: addressSchema.partial().optional(),
      contactNumber: z.string().min(10, "Contact number must be at least 10 characters").optional(),
      email: z.string().email("Invalid email format").optional(),
      services: z.array(z.string().min(2, "Service must be at least 2 characters")).optional()
    })
  })
};