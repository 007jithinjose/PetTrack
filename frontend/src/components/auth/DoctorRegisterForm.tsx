// src/components/auth/DoctorRegisterForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/apiService';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { hospitalService } from '@/services/apiService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization must be at least 2 characters'),
  hospital: z.string().min(1, 'Please select a hospital'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface Hospital {
  _id: string;
  id: string;
  name: string;
  url: string;
}

interface DoctorRegisterFormProps {
  onSuccess?: () => void;
}

export function DoctorRegisterForm({ onSuccess }: DoctorRegisterFormProps) {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadHospitals() {
      try {
        const response = await hospitalService.getHospitalsForRegistration();
        if (response && Array.isArray(response)) {
          setHospitals(response);
        } else {
          toast.error('Invalid hospitals data received');
        }
      } catch (error) {
        toast.error('Failed to load hospitals');
      } finally {
        setLoading(false);
      }
    }
    loadHospitals();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      specialization: '',
      hospital: '',
      contactNumber: '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const response = await authService.registerDoctor({
        ...values,
        hospital: values.hospital // Using the selected hospital ID
      });
      toast.success('Registration successful!');
      navigate('/doctor');
      onSuccess?.();
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <FormControl>
                <Input placeholder="Veterinary Surgery" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hospital"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hospital</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Loading hospitals..." : "Select a hospital"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hospitals.map((hospital) => (
                    <SelectItem key={hospital._id} value={hospital._id}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Loading...' : 'Register as Veterinarian'}
        </Button>
      </form>
    </Form>
  );
}