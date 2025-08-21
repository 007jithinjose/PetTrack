// File: src/hooks/useMedicalRecords.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalService } from '@/services/apiService';
import { toast } from 'sonner';
import { CreateMedicalRecordInput } from '@/services/interfaces';

export const useMedicalRecords = (petId: string) => {
  return useQuery({
    queryKey: ['medical-records', petId],
    queryFn: () => medicalService.getPetMedicalRecords(petId),
    enabled: !!petId,
    select: (response) => response.data,
  });
};

export const useCreateMedicalRecord = (petId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateMedicalRecordInput, 'petId'>) => // petId is already in the mutation context
      medicalService.createMedicalRecord(petId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records', petId] });
      toast.success('Medical record created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create medical record');
    },
  });
};

export const useTreatmentSuggestions = () => {
  return useMutation({
    mutationFn: (symptoms: string[]) => medicalService.suggestTreatments(symptoms),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to get treatment suggestions');
    },
  });
};

export const useAppointmentRecords = (appointmentId: string) => {
  return useQuery({
    queryKey: ['appointment-records', appointmentId],
    queryFn: () => medicalService.getAppointmentRecords(appointmentId),
    enabled: !!appointmentId,
    select: (response) => response.data,
  });
};