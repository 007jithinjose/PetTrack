import { z } from "zod";
import mongoose from "mongoose";

export const createMedicalRecordSchema = z.object({
  body: z.object({
    symptoms: z
      .array(z.string().min(1, "Symptom is required"))
      .min(1, "At least one symptom is required"),
    diagnosis: z.string().min(1, "Diagnosis is required"),
    treatment: z
      .array(z.string().min(1, "Treatment is required"))
      .min(1, "At least one treatment is required"),
    prescribedMedications: z
      .array(z.string().min(1, "Medication is required"))
      .optional(),
    notes: z.string().optional(),
    followUpDate: z.coerce
      .date()
      .refine(
        (date) => !date || date >= new Date(new Date().setHours(0, 0, 0, 0)),
        {
          message: "Follow-up date must be today or in the future",
        },
      )
      .optional(),
  }),
  params: z.object({
    petId: z
      .string()
      .min(1, "Pet ID is required")
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid pet ID",
      }),
  }),
});

export const updateMedicalRecordSchema = z.object({
  body: z.object({
    symptoms: z.array(z.string().min(1, "Symptom is required")).optional(),
    diagnosis: z.string().min(1, "Diagnosis is required").optional(),
    treatment: z.array(z.string().min(1, "Treatment is required")).optional(),
    prescribedMedications: z
      .array(z.string().min(1, "Medication is required"))
      .optional(),
    notes: z.string().optional(),
    followUpDate: z.coerce
      .date()
      .refine((date) => date > new Date(), {
        message: "Follow-up date must be in the future",
      })
      .optional()
      .nullable(),
  }),
  params: z.object({
    id: z
      .string()
      .min(1, "Record ID is required")
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid record ID",
      }),
  }),
});

// Other schemas remain the same as in your original file
export const suggestTreatmentsSchema = z.object({
  body: z.object({
    symptoms: z
      .array(z.string().min(1, "Symptom is required"))
      .min(1, "At least one symptom is required"),
  }),
});

export const getMedicalRecordsSchema = z.object({
  params: z.object({
    petId: z
      .string()
      .min(1, "Pet ID is required")
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid pet ID",
      }),
  }),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).optional(),
  }),
});

export const getMedicalRecordSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, "Record ID is required")
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid record ID",
      }),
  }),
});

export const getAppointmentRecordsSchema = z.object({
  params: z.object({
    appointmentId: z
      .string()
      .min(1, "Appointment ID is required")
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid appointment ID",
      }),
  }),
});

export type CreateMedicalRecordInput = z.infer<
  typeof createMedicalRecordSchema
>;
export type UpdateMedicalRecordInput = z.infer<
  typeof updateMedicalRecordSchema
>;
export type SuggestTreatmentsInput = z.infer<typeof suggestTreatmentsSchema>;
