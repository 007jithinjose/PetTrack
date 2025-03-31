// src/components/layout/MainNav.tsx
import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';
import { LogoutButton } from './LogoutButton';
import { isAuthenticated } from '@/utils/auth';
import { PawPrintIcon } from '@/pages/LandingPage';

export function MainNav() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <PawPrintIcon className="h-6 w-6 text-blue-600" />
          <span>PetTrack</span>
        </Link>
        {isAuthenticated() && (
          <>
            <Link to="/appointments" className="text-sm font-medium">
              Appointments
            </Link>
            <Link to="/pets" className="text-sm font-medium">
              My Pets
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

