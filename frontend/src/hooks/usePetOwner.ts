// src/hooks/usePetOwner.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petOwnerService } from '../services/apiService';
import { getUserData } from '@/utils/auth';
import { toast } from 'sonner';

export function usePetOwner() {
  const  user  = getUserData();
  const queryClient = useQueryClient();

  // Get pets
  const petsQuery = useQuery({
    queryKey: ['myPets', user?._id],
    queryFn: () => petOwnerService.getMyPets(user?._id || ''),
    select: (res) => res.data || [],
    enabled: !!user?._id
  });

  // Get appointments
  const appointmentsQuery = useQuery({
    queryKey: ['myAppointments', user?._id],
    queryFn: () => petOwnerService.getMyAppointments(user?._id || '', { upcoming: true }),
    select: (res) => res.data || [],
    enabled: !!user?._id
  });

  // Cancel appointment
  const cancelAppointment = useMutation({
    mutationFn: (appointmentId: string) => 
      petOwnerService.cancelMyAppointment(user?._id || '', appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['myAppointments', user?._id]);
      toast.success('Appointment cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to cancel appointment', {
        description: error.message || 'Please try again later'
      });
    }
  });

  // Reschedule appointment
  const rescheduleAppointment = useMutation({
    mutationFn: ({ appointmentId, newDate }: { appointmentId: string; newDate: Date | string }) => 
      petOwnerService.rescheduleMyAppointment(user?._id || '', appointmentId, newDate),
    onSuccess: () => {
      queryClient.invalidateQueries(['myAppointments', user?._id]);
      toast.success('Appointment rescheduled successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to reschedule appointment', {
        description: error.message || 'Please try again later'
      });
    }
  });

  return {
    pets: petsQuery.data || [],
    isLoadingPets: petsQuery.isLoading,
    petsError: petsQuery.error,

    appointments: appointmentsQuery.data || [],
    isLoadingAppointments: appointmentsQuery.isLoading,
    appointmentsError: appointmentsQuery.error,

    cancelAppointment: cancelAppointment.mutate,
    isCancelling: cancelAppointment.isLoading,

    rescheduleAppointment: rescheduleAppointment.mutate,
    isRescheduling: rescheduleAppointment.isLoading
  };
}