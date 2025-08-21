// src/components/pets/PetForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { petService } from '@/services/apiService';
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
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const petFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['dog', 'cat', 'bird', 'other']),
  breed: z.string().min(1, 'Breed is required'),
  age: z.number().min(0, 'Age must be positive'),
  weight: z.number().min(0, 'Weight must be positive'),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface PetFormProps {
  isEdit?: boolean;
}

export function PetForm({ isEdit = false }: PetFormProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: '',
      type: 'dog',
      breed: '',
      age: 0,
      weight: 0,
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      async function loadPet() {
        try {
          const response = await petService.getPet(id);
          form.reset(response.data);
        } catch (error) {
          toast.error('Failed to load pet details');
        }
      }
      loadPet();
    }
  }, [isEdit, id, form]);

  async function onSubmit(values: PetFormValues) {
    try {
      if (isEdit && id) {
        await petService.updatePet(id, values);
        toast.success('Pet updated successfully');
      } else {
        await petService.createPet(values);
        toast.success('Pet added successfully');
      }
      navigate('/pets');
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Pet name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <select {...field} className="block w-full p-2 border rounded">
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="other">Other</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Breed</FormLabel>
              <FormControl>
                <Input placeholder="Breed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age (years)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Age" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Weight" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          {isEdit ? 'Update Pet' : 'Add Pet'}
        </Button>
      </form>
    </Form>
  );
}