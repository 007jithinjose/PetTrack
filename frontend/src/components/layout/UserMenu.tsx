// src/components/layout/UserMenu.tsx
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { getUserData } from '@/utils/auth';
  import { LogoutButton } from './LogoutButton';
  
  export function UserMenu() {
    const userData = getUserData();
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={userData?.role === 'doctor' 
                ? '/avatars/michael.jpeg' 
                : '/avatars/emma.jpeg'} 
            />
            <AvatarFallback>
              {userData?.role === 'doctor' ? 'DR' : 'PO'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <LogoutButton 
              variant="ghost" 
              className="w-full justify-start px-2" 
              showText={true}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }