// src/components/auth/AuthWrapper.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '@/utils/auth';
import { toast } from 'sonner';

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'petowner' | 'doctor'; // Use lowercase only
}

export function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
  const navigate = useNavigate();
  const userData = getUserData();

  useEffect(() => {
    if (!userData) {
      navigate('/auth/login');
      return;
    }

    if (requiredRole) {
      // Compare lowercase roles
      if (userData.role !== requiredRole) {
        toast.error(`You need to be a ${requiredRole} to access this page`);
        navigate('/');
      }
    }
  }, [userData, navigate, requiredRole]);

  if (!userData || (requiredRole && userData.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}