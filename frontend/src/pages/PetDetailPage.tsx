// src/pages/PetDetailPage.tsx
import { PetDetail } from '@/components/pets/PetDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PetMedicalRecordsPage } from './PetMedicalRecordsPage';


export function PetDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4">
        <div className="container mx-auto space-y-4">
          <PetDetail />
          
          <Tabs defaultValue="medical" className="w-full">
            <TabsList>
              <TabsTrigger value="medical">Medical Records</TabsTrigger>
            </TabsList>
            
            <TabsContent value="medical">
              <PetMedicalRecordsPage />
            </TabsContent>
            
          </Tabs>
        </div>
      </main>
    </div>
  );
}