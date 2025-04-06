// src/components/appointments/BookingForm.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateAppointmentDTO } from '../../services/interfaces/appointment.interface';
import { usePets } from '../../hooks/usePets';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { hospitalService } from '../../services/apiService';
import { Hospital, DoctorReference } from '../../services/interfaces/hospital.interface';
import { appointmentService } from '../../services/apiService';
import { toast } from 'sonner';
import { Pet } from '@/services/interfaces';

const appointmentSchema = z.object({
  doctorId: z.string({ required_error: "Doctor is required" }).min(1),
  petId: z.string({ required_error: "Pet is required" }).min(1),
  date: z.date({ required_error: "Date is required" }),
  reason: z.string({ required_error: "Reason is required" })
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason cannot exceed 500 characters"),
  notes: z.string().max(1000).optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface BookingFormProps {
  pets: Pet[];
  onSuccess?: () => void;
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const { pets } = usePets();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<DoctorReference[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: '',
      petId: '',
      date: undefined,
      reason: '',
      notes: ''
    }
  });

  // Fetch hospitals with error handling
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoadingHospitals(true);
        const response = await hospitalService.getHospitals();
        
        if (response.status === 'success' && Array.isArray(response.data)) {
          setHospitals(response.data);
        } else {
          toast.error('Failed to load hospitals');
        }
      } catch {
        toast.error('Failed to load hospitals');
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  // Fetch doctors when hospital changes
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const handleHospitalChange = async (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    if (!hospitalId) {
      setDoctors([]);
      form.setValue('doctorId', '');
      return;
    }

    setLoadingDoctors(true);
    try {
      const response = await hospitalService.getHospitalDoctors(hospitalId);
      if (response.status === 'success' && Array.isArray(response.data)) {
        setDoctors(response.data);
      } else {
        toast.error('Failed to load doctors');
        setDoctors([]);
      }
    } catch {
      toast.error('Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Processing your appointment...');
    
    try {
      // Prepare payload matching your API structure exactly
      const payload: CreateAppointmentDTO = {
        doctorId: data.doctorId,
        petId: data.petId,
        date: data.date.toISOString(),
        reason: data.reason,
        notes: data.notes
      };

      const response = await appointmentService.createAppointment(payload);
      
      if (response.success) {
        toast.success('Appointment booked successfully!', {
          id: toastId,
          description: `Scheduled for ${format(data.date, 'PPPp')}`
        });
        form.reset();
        onSuccess?.();
      } else {
        toast.error(response.message || 'Failed to book appointment', { 
          id: toastId,
          description: 'Please check your information and try again'
        });
      }
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        if ((error as { response?: { data?: { errors?: Record<string, string[]> } } })?.response?.data?.errors) {
          errorMessage = Object.values((error.response as { data: { errors: Record<string, string[]> } }).data.errors)
            .flat()
            .join(', ');
        } else if ((error.response.data as { message?: string })?.message) {
          errorMessage = (error.response.data as { message?: string }).message || errorMessage;
        }
      } else if (error instanceof Error && 'request' in error) {
        errorMessage = 'Network error - please check your connection';
      }

      toast.error('Booking failed', {
        id: toastId,
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Hospital Selection (not part of API payload but needed for doctor selection) */}
        <FormItem>
          <FormLabel>Hospital</FormLabel>
          <Select 
            onValueChange={handleHospitalChange} 
            value={selectedHospitalId}
            disabled={loadingHospitals}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingHospitals ? "Loading hospitals..." : "Select a hospital"} />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map((hospital) => (
                <SelectItem key={hospital._id} value={hospital._id}>
                  {hospital.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!loadingHospitals && hospitals.length === 0 && (
            <p className="text-sm text-muted-foreground">No hospitals available</p>
          )}
        </FormItem>

        {/* Doctor Selection */}
        <FormField
          control={form.control}
          name="doctorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={!selectedHospitalId || loadingDoctors || doctors.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !selectedHospitalId ? "Select a hospital first" :
                    loadingDoctors ? "Loading doctors..." : 
                    doctors.length === 0 ? "No doctors available" : "Select a doctor"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      {doctor.name} ({doctor.specialization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pet Selection */}
        <FormField
          control={form.control}
          name="petId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={pets.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={pets.length === 0 ? "No pets available" : "Select a pet"} />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet._id} value={pet._id}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Selection */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Appointment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline">
                      {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reason */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Reason for appointment (min. 10 characters)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes (symptoms, behaviors, etc.)" 
                  {...field} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={
            isSubmitting ||
            !form.watch('doctorId') ||
            !form.watch('petId') ||
            !form.watch('date') ||
            !form.watch('reason')
          }
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </form>
    </Form>
  );
}