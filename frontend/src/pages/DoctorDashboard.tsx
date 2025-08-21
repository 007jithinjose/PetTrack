// src/pages/DoctorDashboard.tsx
import { DoctorAppointments } from '@/components/appointments/DoctorAppointments';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/apiService';
import { Skeleton } from '@/components/ui/skeleton';

export function DoctorDashboard() {
  
  // Get current user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => {
      const userData = authService.getCurrentUser();
      return Promise.resolve(userData);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
          <DoctorAppointments />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {user?.name || 'Doctor'}
            </Badge>
          </div>
        </div>

        <DoctorAppointments />
      </main>
    </div>
  );
}