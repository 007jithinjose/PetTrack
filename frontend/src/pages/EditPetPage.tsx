// src/pages/EditPetPage.tsx
import { MainNav } from '@/components/layout/MainNav';
import { PetForm } from '@/components/pets/PetForm';

export function EditPetPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <MainNav />
      </header>
      
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-md">
          <PetForm isEdit />
        </div>
      </main>
    </div>
  );
}