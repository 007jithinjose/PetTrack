// File: src/hooks/usePrescriptions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionService } from '@/services/apiService';
import { toast } from 'sonner';
import { CreatePrescriptionInput } from '@/services/interfaces';

export const usePrescriptions = (petId: string) => {
  return useQuery({
    queryKey: ['prescriptions', petId],
    queryFn: () => prescriptionService.getPetPrescriptions(petId),
    enabled: !!petId,
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to load prescriptions');
    },
  });
};

export const useCreatePrescription = (petId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePrescriptionInput) => prescriptionService.createPrescription(petId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions', petId] });
      toast.success('Prescription created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    },
  });
};

export const useGeneratePrescriptionPDF = () => {
  return useMutation({
    mutationFn: (id: string) => prescriptionService.generatePrescriptionPDF(id),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate prescription PDF');
    },
  });
};