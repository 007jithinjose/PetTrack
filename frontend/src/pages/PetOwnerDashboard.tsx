// src/pages/PetOwnerDashboard.tsx
import { Button } from '@/components/ui/button';
import { CalendarDays, PlusCircle, Stethoscope, Bell, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { petService } from '@/services/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function PetOwnerDashboard() {
  // Fetch pets for the current owner
  const { data: pets, isLoading } = useQuery({
    queryKey: ['myPets'],
    queryFn: () => petService.getPets({}),
    select: (res) => res.data || []
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pet Owner Dashboard</h1>
        <Button asChild>
          <Link to="/pets/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Pet
          </Link>
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{pets?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medical Alerts</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pets Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Pets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={`pet-skeleton-${i}`} className="h-20 w-full" />
              ))}
            </div>
          ) : pets && pets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pets.slice(0, 3).map((pet) => (
                <Card key={pet._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <PawPrint className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pet.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {pet.breed} • {pet.age} years
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/pets/${pet._id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pets found</p>
              <Button asChild variant="link" className="mt-2">
                <Link to="/pets/new">Add your first pet</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Button asChild variant="outline" className="h-24 flex-col gap-2">
          <Link to="/appointments">
            <CalendarDays className="h-6 w-6" />
            <span>Book Appointment</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-24 flex-col gap-2">
          <Link to="/pets">
            <PawPrint className="h-6 w-6" />
            <span>Manage Pets</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-24 flex-col gap-2">
          <Link to="/appointments">
            <Stethoscope className="h-6 w-6" />
            <span>View Medical History</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}