// src/pages/EditPetPage.tsx
import { PetForm } from '@/components/pets/PetForm';

export function EditPetPage() {
  return (
    <div className="min-h-screen flex flex-col">     
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-md">
          <PetForm isEdit />
        </div>
      </main>
    </div>
  );
}