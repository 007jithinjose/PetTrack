// src/components/auth/DoctorRegisterForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService, hospitalService } from '@/services/apiService';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { handleApiError } from '@/utils/errorHandler';

const formSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  specialization: z.string()
    .min(2, 'Specialization must be at least 2 characters')
    .max(50, 'Specialization must be less than 50 characters'),
  hospital: z.string()
    .min(1, 'Please select a hospital'),
  contactNumber: z.string()
    .min(10, 'Contact number must be at least 10 characters')
    .max(15, 'Contact number must be less than 15 characters')
    .regex(/^[+]?[0-9]+$/, 'Contact number must contain only numbers and optional + prefix'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type FormValues = z.infer<typeof formSchema>;

interface Hospital {
  _id: string;
  name: string;
}

interface DoctorRegisterFormProps {
  onSuccess?: () => void;
}

export function DoctorRegisterForm({ onSuccess }: DoctorRegisterFormProps) {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const response = await hospitalService.getHospitalsForRegistration();
        if (response.data && Array.isArray(response.data)) {
          setHospitals(response.data);
        } else {
          toast.error('Invalid hospital data format received');
          setHospitals([]);
        }
      } catch (error) {
        const errorMessage = handleApiError(error);
        toast.error(errorMessage);
        console.error('Hospital loading error:', error);
        setHospitals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHospitals();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      specialization: '',
      hospital: '',
      contactNumber: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = values;
      
      await authService.registerDoctor(submitData);
      
      toast.success('Registration successful! You can now login.');
      onSuccess?.();
      navigate('/auth/login');
    } catch (error) {
      const err = error as AxiosError;
      
      // Handle backend validation errors
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        
        Object.keys(backendErrors).forEach((field) => {
          form.setError(field as keyof FormValues, {
            type: 'manual',
            message: backendErrors[field].join(', ')
          });
        });
        
        toast.error('Please fix the errors in the form');
      } else {
        // Use our centralized error handler for other errors
        const errorMessage = handleApiError(error);
        toast.error(errorMessage);
      }
      
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <Input 
                  placeholder="Dr. Smith" 
                  {...field} 
                  autoComplete="name"
                />
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
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  {...field} 
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Veterinary Surgery" 
                  {...field} 
                />
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
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={isLoading ? "Loading hospitals..." : "Select a hospital"} 
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hospitals.length > 0 ? (
                    hospitals.map((hospital) => (
                      <SelectItem key={hospital._id} value={hospital._id}>
                        {hospital.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No hospitals available
                    </SelectItem>
                  )}
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
                <Input 
                  placeholder="+1234567890" 
                  {...field} 
                  autoComplete="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            'Register as Veterinarian'
          )}
        </Button>
      </form>
    </Form>
  );
}