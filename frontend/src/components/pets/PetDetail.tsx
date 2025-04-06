// src/components/pets/PetDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petService } from '@/services/apiService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

export function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPet() {
      try {
        const response = await petService.getPet(id!);
        setPet(response.data);
      } catch (error) {
        toast.error('Failed to load pet details');
        navigate('/pets');
      } finally {
        setLoading(false);
      }
    }
    loadPet();
  }, [id, navigate]);

  async function handleDelete() {
    try {
      await petService.deletePet(id!);
      toast.success('Pet deleted successfully');
      navigate('/pets');
    } catch (error) {
      toast.error('Failed to delete pet');
    }
  }

  if (loading) return <div>Loading pet details...</div>;
  if (!pet) return <div>Pet not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Pet Details</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(`/pets/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{pet.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Type:</strong> {pet.type}</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Age:</strong> {pet.age} years</p>
          <p><strong>Weight:</strong> {pet.weight} kg</p>
        </CardContent>
      </Card>
    </div>
  );
}