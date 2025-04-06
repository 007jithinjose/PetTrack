// src/components/pets/PetList.tsx
import { useEffect, useState } from 'react';
import { petService } from '@/services/apiService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function PetList() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPets() {
      try {
        const response = await petService.getPets();
        setPets(response.data || []);
      } catch (error) {
        toast.error('Failed to load pets');
      } finally {
        setLoading(false);
      }
    }
    loadPets();
  }, []);

  if (loading) return <div>Loading pets...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Pets</h2>
        <Button asChild>
          <Link to="/pets/new">Add New Pet</Link>
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Breed</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pets.map((pet) => (
            <TableRow key={pet._id}>
              <TableCell>{pet.name}</TableCell>
              <TableCell>{pet.type}</TableCell>
              <TableCell>{pet.breed}</TableCell>
              <TableCell>{pet.age}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/pets/${pet._id}`}>View</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/pets/${pet._id}/edit`}>Edit</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}