// src/pages/PetFormPage.tsx
import { PetForm } from '@/components/pets/PetForm';

export function PetFormPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-md">
          <PetForm />
        </div>
      </main>
    </div>
  );
}