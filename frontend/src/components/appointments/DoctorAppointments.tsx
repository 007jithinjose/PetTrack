// src/components/appointments/DoctorAppointments.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment, AppointmentQueryParams, QueryableAppointmentStatus, PaginatedAppointments } from '@/services/interfaces/appointment.interface';
import { AppointmentCard } from './AppointmentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useState } from 'react';
import { appointmentService } from '@/services/apiService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function DoctorAppointments() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<QueryableAppointmentStatus>('pending');
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newAppointmentDate, setNewAppointmentDate] = useState<Date | undefined>();

  // Fetch doctor's appointments
  const { 
    data: appointmentsData, 
    isLoading, 
    isError,
    refetch
  } = useQuery<PaginatedAppointments>({
    queryKey: ['doctor-appointments', selectedStatus, selectedDate],
    queryFn: async () => {
      const params: AppointmentQueryParams = {
        status: selectedStatus,
      };
      
      if (selectedDate) {
        params.startDate = selectedDate.toISOString();
        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
        params.endDate = endDate.toISOString();
      }

      try {
        const response = await appointmentService.getDoctorAppointments(params);
        if (!response) {
          throw new Error('No data returned from API');
        }
        return response;
      } catch (error) {
        console.error('Error fetching appointments:', error);
        throw new Error('Failed to fetch appointments');
      }
    },
  });

  // Extract appointments from response data
  const appointments: Appointment[] = appointmentsData?.data || [];
  const stats = {
    pending: appointments.filter((appt: Appointment) => appt.status === 'pending').length,
    confirmed: appointments.filter((appt: Appointment) => appt.status === 'confirmed').length,
    completed: appointments.filter((appt: Appointment) => appt.status === 'completed').length,
    cancelled: appointments.filter((appt: Appointment) => appt.status === 'cancelled').length,
  };

  // Mutation for confirming appointment with optimistic updates
  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      return appointmentService.confirmAppointment(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['doctor-appointments'] });
      const previousData = queryClient.getQueryData<PaginatedAppointments>(['doctor-appointments']);

      queryClient.setQueryData(['doctor-appointments'], (old: PaginatedAppointments | undefined) => ({
        ...old,
        data: old?.data?.map((appt: Appointment) => 
          appt.id === id ? { ...appt, status: 'confirmed' } : appt
        ) || []
      }));

      return { previousData };
    },
    onSuccess: () => {
      toast.success('Appointment confirmed successfully!');
    },
    onError: (err: Error, id: string, context: { previousData?: PaginatedAppointments } | undefined) => {
      toast.error(err.message || 'Failed to confirm appointment');
      if (context?.previousData) {
        queryClient.setQueryData(['doctor-appointments'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
    }
  });

  // Mutation for cancelling appointment with optimistic updates
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return appointmentService.cancelAppointment(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['doctor-appointments'] });
      const previousData = queryClient.getQueryData<PaginatedAppointments>(['doctor-appointments']);

      queryClient.setQueryData(['doctor-appointments'], (old: PaginatedAppointments | undefined) => ({
        ...old,
        data: old?.data?.map((appt: Appointment) => 
          appt.id === id ? { ...appt, status: 'cancelled' } : appt
        ) || []
      }));

      return { previousData };
    },
    onSuccess: () => {
      toast.success('Appointment cancelled successfully!');
    },
    onError: (err: Error, id: string, context: { previousData?: PaginatedAppointments } | undefined) => {
      toast.error(err.message || 'Failed to cancel appointment');
      if (context?.previousData) {
        queryClient.setQueryData(['doctor-appointments'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
    }
  });

  // Mutation for rescheduling appointment with optimistic updates
  const rescheduleMutation = useMutation({
    mutationFn: async ({ id, date }: { id: string, date: string }) => {
      return appointmentService.rescheduleAppointment(id, date);
    },
    onMutate: async ({ id, date }) => {
      await queryClient.cancelQueries({ queryKey: ['doctor-appointments'] });
      const previousData = queryClient.getQueryData<PaginatedAppointments>(['doctor-appointments']);

      queryClient.setQueryData(['doctor-appointments'], (old: PaginatedAppointments | undefined) => ({
        ...old,
        data: old?.data?.map((appt: Appointment) => 
          appt.id === id ? { ...appt, date } : appt
        ) || []
      }));

      return { previousData };
    },
    onSuccess: () => {
      toast.success('Appointment rescheduled successfully!');
      setReschedulingId(null);
      setNewAppointmentDate(undefined);
    },
    onError: (err: Error, variables: { id: string, date: string }, context: { previousData?: PaginatedAppointments } | undefined) => {
      toast.error(err.message || 'Failed to reschedule appointment');
      if (context?.previousData) {
        queryClient.setQueryData(['doctor-appointments'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
    }
  });

  // Filter appointments by date
  const filteredAppointments = selectedDate 
    ? appointments.filter((appt: Appointment) => 
        format(new Date(appt.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
    : appointments;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Failed to load appointments.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reschedule Modal */}
      <Dialog open={!!reschedulingId} onOpenChange={() => setReschedulingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={newAppointmentDate}
              onSelect={setNewAppointmentDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
            <Button
              onClick={() => {
                if (newAppointmentDate && reschedulingId) {
                  rescheduleMutation.mutate({
                    id: reschedulingId,
                    date: newAppointmentDate.toISOString()
                  });
                }
              }}
              disabled={!newAppointmentDate || rescheduleMutation.isPending}
            >
              {rescheduleMutation.isPending ? 'Rescheduling...' : 'Confirm Reschedule'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
          <p className="text-2xl font-bold">{stats.confirmed}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
      </div>

      {/* Date Picker */}
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
        {selectedDate && (
          <Button 
            variant="ghost" 
            className="mt-2"
            onClick={() => setSelectedDate(undefined)}
          >
            Clear date filter
          </Button>
        )}
      </div>

      {/* Appointments List */}
      <Tabs 
        value={selectedStatus} 
        onValueChange={(value) => setSelectedStatus(value as QueryableAppointmentStatus)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {filteredAppointments
              .filter((appt: Appointment) => appt.status === 'pending')
              .map((appointment: Appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isDoctorView
                  onConfirm={() => confirmMutation.mutate(appointment.id)}
                  onCancel={() => cancelMutation.mutate(appointment.id)}
                  onReschedule={() => setReschedulingId(appointment.id)}
                  isConfirming={confirmMutation.isPending && confirmMutation.variables === appointment.id}
                  isCancelling={cancelMutation.isPending && cancelMutation.variables === appointment.id}
                />
              ))}
            {filteredAppointments.filter((appt: Appointment) => appt.status === 'pending').length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">
                No pending appointments
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="confirmed">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {filteredAppointments
              .filter((appt: Appointment) => appt.status === 'confirmed')
              .map((appointment: Appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isDoctorView
                  onReschedule={() => setReschedulingId(appointment.id)}
                  isRescheduling={rescheduleMutation.isPending && rescheduleMutation.variables?.id === appointment.id}
                />
              ))}
            {filteredAppointments.filter((appt: Appointment) => appt.status === 'confirmed').length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">
                No confirmed appointments
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {filteredAppointments
              .filter((appt: Appointment) => appt.status === 'completed')
              .map((appointment: Appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isDoctorView
                  isReadOnly
                />
              ))}
            {filteredAppointments.filter((appt: Appointment) => appt.status === 'completed').length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">
                No completed appointments
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}