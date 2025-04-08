// File: src/validations/prescription.validation.ts
import { z } from 'zod';

const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required')
});

export const createPrescriptionSchema = z.object({
  body: z.object({
    medications: z.array(medicationSchema).min(1, 'At least one medication is required'),
    instructions: z.string().optional()
  }),
  params: z.object({
    petId: z.string().min(1, 'Pet ID is required')
  })
});

export const getPrescriptionsSchema = z.object({
  params: z.object({
    petId: z.string().min(1, 'Pet ID is required')
  }),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).optional()
  })
});

export const generatePrescriptionPdfSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Prescription ID is required')
  })
});

export const getPrescriptionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Prescription ID is required')
  })
});

export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;