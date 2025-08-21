// src/components/layout/LogoutButton.tsx
import { Button } from '@/components/ui/button';
import { authService } from '@/services/apiService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { removeAuthData } from '@/utils/auth';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  showText?: boolean;
}

export function LogoutButton({
  variant = 'outline',
  className = '',
  showText = true,
}: LogoutButtonProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      removeAuthData();
      navigate('/auth/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      className={`hover:bg-red-50 hover:text-red-600 ${className}`}
      aria-label="Logout"
    >
      {showText && <span className="mr-2">Logout</span>}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </Button>
  );
}