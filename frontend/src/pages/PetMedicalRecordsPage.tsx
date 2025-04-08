// File: src/pages/PetMedicalRecordsPage.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MedicalRecordCard } from '@/components/medical/MedicalRecordCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { medicalService } from '@/services/apiService';

export function PetMedicalRecordsPage() {
  const { id: petId } = useParams<{ id: string }>();
  
  const { 
    data: recordsResponse, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['medical-records', petId],
    queryFn: () => medicalService.getPetMedicalRecords(petId || ''),
    enabled: !!petId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/pets">
              <ChevronLeft className="h-4 w-4" />
              Back to Pets
            </Link>
          </Button>
        </div>
        <Skeleton className="h-10 w-48" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={`skeleton-${i}`} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/pets">
              <ChevronLeft className="h-4 w-4" />
              Back to Pets
            </Link>
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load medical records</p>
        </div>
      </div>
    );
  }

  // Extract records from the response - adjust this based on your API response structure
  const records = recordsResponse?.data?.data || recordsResponse?.data || [];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Button asChild variant="ghost" className="gap-2">
          <Link to="/pets">
            <ChevronLeft className="h-4 w-4" />
            Back to Pets
          </Link>
        </Button>
      </div>

      <h2 className="text-xl font-bold">Medical Records</h2>

      {records.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No medical records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <MedicalRecordCard 
              key={record._id} 
              record={record} 
            />
          ))}
        </div>
      )}
    </div>
  );
}