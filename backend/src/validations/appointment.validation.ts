// File: src/validations/appointment.validation.ts
import { z } from 'zod';
import { AppointmentStatus } from '../interfaces/appointment.interface';

const mongoIdSchema = z.string({
  required_error: "ID is required",
  invalid_type_error: "ID must be a string"
}).regex(/^[0-9a-fA-F]{24}$/, {
  message: "Invalid MongoDB ID format (24-character hex string)"
});

// Base appointment schema
const appointmentBaseSchema = z.object({
  petId: mongoIdSchema,
  doctorId: mongoIdSchema,
  date: z.string({
    required_error: "Date is required",
    invalid_type_error: "Date must be an ISO 8601 string"
  }).datetime({
    message: "Invalid ISO 8601 date format"
  }).refine(
    date => new Date(date) > new Date(), 
    "Appointment date must be in the future"
  ),
  reason: z.string({
    required_error: "Reason is required",
    invalid_type_error: "Reason must be a string"
  }).min(10, "Reason must be at least 10 characters")
   .max(500, "Reason cannot exceed 500 characters"),
  notes: z.string().max(1000).optional()
});

// Schemas for different endpoints
export const createAppointmentSchema = z.object({
  body: appointmentBaseSchema.strict()
});

export const updateAppointmentSchema = z.object({
  body: appointmentBaseSchema
    .omit({ petId: true, doctorId: true })
    .extend({
      status: z.nativeEnum(AppointmentStatus).optional()
    })
    .partial()
    .strict()
});

export const rescheduleAppointmentSchema = z.object({
  body: z.object({
    date: z.string({
      required_error: "New date is required"
    }).datetime()
     .refine(
       date => new Date(date) > new Date(),
       "New date must be in the future"
     )
  }).strict()
});

export const completeAppointmentSchema = z.object({
  body: z.object({
    notes: z.string().max(1000).optional()
  }).strict()
});

export const appointmentQuerySchema = z.object({
  query: z.object({
    petId: z.union([mongoIdSchema, z.array(mongoIdSchema)]).optional(),
    doctorId: mongoIdSchema.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.nativeEnum(AppointmentStatus).optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional()
  }).strict()
});
export const confirmAppointmentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Appointment ID is required')
  })
});