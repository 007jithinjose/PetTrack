// src/components/layout/MainNav.tsx
import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';
import { LogoutButton } from './LogoutButton';
import { isAuthenticated, getUserData } from '@/utils/auth';
import { PawPrintIcon } from '@/pages/LandingPage';

export function MainNav() {
  const userData = getUserData();
  const isDoctor = userData?.role.toLowerCase() === 'doctor';
  const isPetOwner = ['petowner', 'pet-owner', 'owner'].includes(userData?.role.toLowerCase() || '');

  // Determine dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!userData) return '/';
    return isDoctor ? '/doctor' : isPetOwner ? '/owner' : '/';
  };

  // Determine appointments URL based on user role
  const getAppointmentsUrl = () => {
    return isDoctor ? '/doctor/appointments' : '/appointments';
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Link 
          to={isAuthenticated() ? getDashboardUrl() : '/'} 
          className="flex items-center gap-2 font-bold text-lg"
        >
          <PawPrintIcon className="h-6 w-6 text-blue-600" />
          <span>PetTrack</span>
        </Link>
        {isAuthenticated() && (
          <>
            {isPetOwner && (
              <Link to="/pets" className="text-sm font-medium">
                My Pets
              </Link>
            )}
            <Link to={getAppointmentsUrl()} className="text-sm font-medium">
              Appointments
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated() ? (
          <>
            <UserMenu />
            <LogoutButton showText={false} className="p-2" />
          </>
        ) : (
          <Link to="/auth/login" className="text-sm font-medium">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}