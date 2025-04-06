// src/pages/PetDetailPage.tsx
import { PetDetail } from '@/components/pets/PetDetail';

export function PetDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4">
        <div className="container mx-auto">
          <PetDetail />
        </div>
      </main>
    </div>
  );
}