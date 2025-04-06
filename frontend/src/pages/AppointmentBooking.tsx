// File: src/pages/AppointmentBooking.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { BookingForm } from '../components/appointments/BookingForm';
import { AppointmentCard } from '../components/appointments/AppointmentCard';
import { CalendarView } from '../components/appointments/CalendarView';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getUserData } from '../utils/auth';
import { appointmentService, petService } from '../services/apiService';
import { format, isSameDay } from 'date-fns';
import { toast } from 'sonner';
import { Calendar } from '../components/ui/calendar';
import { Loader2 } from 'lucide-react';

export function AppointmentBooking() {
  const user = getUserData();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState<{
    appointmentId: string | null;
    currentDate: Date | null;
  }>({ appointmentId: null, currentDate: null });

  // Fetch pets for the current owner
  const { data: pets = [], isLoading: isLoadingPets } = useQuery({
    queryKey: ['myPets', user?._id],
    queryFn: () => petService.getPets({ ownerId: user?._id }),
    select: (res) => res.data || [],
    enabled: !!user?._id
  });

  // Fetch appointments for the current owner's pets
  const { 
    data: appointments = [], 
    isLoading: isLoadingAppointments,
    error: appointmentsError,
    refetch: refetchAppointments
  } = useQuery({
    queryKey: ['myAppointments', user?._id],
    queryFn: () => {
      const petIds = pets.map(pet => pet._id);
      return appointmentService.getAppointments({
        petId: petIds // Now sends as array
      });
    },
    enabled: !!user?._id && pets.length > 0,
    select: (res) => Array.isArray(res.data) ? res.data : []
  });

  // Debug effect to log data
  useEffect(() => {
    console.log('Appointments data:', appointments);
    console.log('Pets data:', pets);
  }, [appointments, pets]);

  // Cancel appointment mutation
  const { mutate: cancelAppointment } = useMutation({
    mutationFn: (appointmentId: string) => 
      appointmentService.cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      toast.success('Appointment cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to cancel appointment', {
        description: error.message || 'Please try again later'
      });
    }
  });

  // Reschedule appointment mutation
  const { mutate: rescheduleAppointment, isPending: isRescheduling } = useMutation({
    mutationFn: ({ id, date }: { id: string; date: Date | string }) => 
      appointmentService.rescheduleAppointment(id, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      toast.success('Appointment rescheduled successfully');
      setRescheduleData({ appointmentId: null, currentDate: null });
    },
    onError: (error: Error) => {
      toast.error('Failed to reschedule appointment', {
        description: error.message || 'Please try again later'
      });
    }
  });

  // Filter appointments by selected date
  const filteredAppointments = selectedDate
    ? appointments.filter(appt => 
        isSameDay(new Date(appt.date), selectedDate)
      )
    : appointments;

  if (appointmentsError) {
    return (
      <div className="p-4 text-center text-destructive">
        Error loading appointments: {appointmentsError.message}
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => refetchAppointments()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const isLoading = isLoadingPets || isLoadingAppointments;

  return (
    <div className="space-y-6">
      {/* Reschedule Dialog */}
      <Dialog 
        open={!!rescheduleData.appointmentId} 
        onOpenChange={(open) => !open && setRescheduleData({ appointmentId: null, currentDate: null })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-2">
              <Calendar
                mode="single"
                selected={rescheduleData.currentDate || new Date()}
                onSelect={(date) => date && setRescheduleData(prev => ({
                  ...prev,
                  currentDate: date
                }))}
                disabled={(date) => date <= new Date()}
                initialFocus
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={() => setRescheduleData({ appointmentId: null, currentDate: null })}
            >
              Cancel
            </Button>
            <Button
              disabled={!rescheduleData.currentDate || isRescheduling}
              onClick={() => {
                if (rescheduleData.appointmentId && rescheduleData.currentDate) {
                  rescheduleAppointment({
                    id: rescheduleData.appointmentId,
                    date: rescheduleData.currentDate
                  });
                }
              }}
            >
              {isRescheduling ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Confirm Reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>New Appointment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <BookingForm 
              pets={pets}
              onSuccess={() => {
                setIsDialogOpen(false);
                refetchAppointments();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments found</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => refetchAppointments()}
              >
                Refresh
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={`appt-${appointment.id}`}
                  appointment={appointment}
                  onCancel={() => cancelAppointment(appointment.id)}
                  onReschedule={(appointmentId) => setRescheduleData({
                    appointmentId,
                    currentDate: new Date(appointment.date)
                  })}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <div className="flex flex-col items-center w-full px-4">
            <div className="w-full max-w-5xl p-6 border rounded-lg bg-white shadow-sm">
              <CalendarView
                appointments={Array.isArray(appointments) ? appointments : []}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
            {selectedDate && (
              <div className="w-full max-w-6xl mt-4">
                <h2 className="text-xl font-semibold">
                  Appointments for {format(selectedDate, 'PPP')}
                </h2>
                {filteredAppointments.length === 0 ? (
                  <p className="text-muted-foreground">No appointments on this day</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center mt-4">
                    {filteredAppointments.map((appointment) => (
                      <AppointmentCard
                        key={`appt-cal-${appointment.id}`}
                        appointment={appointment}
                        onCancel={() => cancelAppointment(appointment.id)}
                        onReschedule={(appointmentId) => setRescheduleData({
                          appointmentId,
                          currentDate: new Date(appointment.date)
                        })}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}