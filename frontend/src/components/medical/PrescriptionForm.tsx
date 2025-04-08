// File: src/components/medical/PrescriptionForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';


const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
});

const formSchema = z.object({
  medications: z.array(medicationSchema).min(1, 'At least one medication is required'),
  instructions: z.string().optional(),
});

interface PrescriptionFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

export function PrescriptionForm({ onSubmit, isLoading }: PrescriptionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: [{
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
      }],
      instructions: '',
    },
  });

  const addMedication = () => {
    form.setValue('medications', [
      ...form.getValues('medications'),
      { name: '', dosage: '', frequency: '', duration: '' },
    ]);
  };

  const removeMedication = (index: number) => {
    const medications = form.getValues('medications');
    if (medications.length > 1) {
      form.setValue('medications', medications.filter((_, i) => i !== index));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <FormLabel>Medications</FormLabel>
          {form.watch('medications').map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
              <FormField
                control={form.control}
                name={`medications.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`medications.${index}.dosage`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Dosage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`medications.${index}.frequency`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Frequency" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`medications.${index}.duration`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Duration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-4 flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeMedication(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addMedication}
            className="mt-2"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Create Prescription'}
        </Button>
      </form>
    </Form>
  );
}