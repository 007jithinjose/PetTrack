// src/pages/DoctorDashboard.tsx
import { MainNav } from '@/components/layout/MainNav';
import { useNavigate } from 'react-router-dom';

export function DoctorDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <MainNav />
      </header>
      
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        </div>
        
        {/* Dashboard content goes here */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Add your dashboard components here */}
        </div>
      </main>
    </div>
  );
}