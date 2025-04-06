//File: src/validations/doctor.validation.ts
import { z } from 'zod';

export const getPatientsSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('10').transform(Number)
  })
});

export const getMedicalHistorySchema = z.object({
  params: z.object({
    petId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid pet ID')
  })
});