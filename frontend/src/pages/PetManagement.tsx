// src/pages/PetManagement.tsx
import { PetList } from '@/components/pets/PetList';

export function PetManagement() {
  return (
    <div className="min-h-screen flex flex-col">  
      <main className="flex-1 p-4">
        <div className="container mx-auto">
          <PetList />
        </div>
      </main>
    </div>
  );
}