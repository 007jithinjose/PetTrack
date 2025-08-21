// src/components/layout/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { MainNav } from './MainNav';

export function DashboardLayout() {
  return (
    <div className={cn(
      "min-h-screen bg-gray-50 flex flex-col",
      "dark:bg-gray-900"
    )}>
      {/* Add the MainNav here */}
      <header className="border-b">
        <MainNav />
      </header>
      
      {/* Main content area */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* Toast notifications */}
      <Toaster position="top-center" richColors expand={true} />
    </div>
  );
}