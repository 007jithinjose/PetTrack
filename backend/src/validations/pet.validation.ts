//File: src/validations/pet.validation.ts
import { z } from 'zod';

export const petValidation = {
  createPet: z.object({
    body: z.object({
      name: z.string().min(2).max(50),
      type: z.string().min(2),
      breed: z.string().min(2),
      age: z.number().min(0),
      weight: z.number().min(0.1)
    })
  }),
  updatePet: z.object({
    params: z.object({
      petId: z.string()
    }),
    body: z.object({
      name: z.string().min(2).max(50).optional(),
      type: z.string().min(2).optional(),
      breed: z.string().min(2).optional(),
      age: z.number().min(0).optional(),
      weight: z.number().min(0.1).optional()
    })
  })
};