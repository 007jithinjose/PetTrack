// src/pages/PetPrescriptionsPage.tsx
import { useParams } from 'react-router-dom';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { PrescriptionCard } from '@/components/medical/PrescriptionCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { PrescriptionForm } from '@/components/medical/PrescriptionForm';
import { useCreatePrescription } from '@/hooks/usePrescriptions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { prescriptionService } from '@/services/apiService';
import { saveAs } from 'file-saver';

export function PetPrescriptionsPage() {
  const { id: petId } = useParams<{ id: string }>();
  const { data: prescriptions, isLoading } = usePrescriptions(petId || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: createPrescription, isPending } = useCreatePrescription(petId || '');

  const handleDownload = async (id: string) => {
    try {
      const response = await prescriptionService.generatePrescriptionPDF(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, `prescription-${id}.pdf`);
    } catch (error) {
      console.error('Error downloading prescription:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Prescriptions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Prescription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Prescription</DialogTitle>
            </DialogHeader>
            <PrescriptionForm
              onSubmit={(values) => {
                createPrescription(values, {
                  onSuccess: () => setIsDialogOpen(false),
                });
              }}
              isLoading={isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {prescriptions?.data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No prescriptions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions?.data.map((prescription) => (
            <PrescriptionCard 
              key={prescription._id} 
              prescription={prescription} 
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}