// src/utils/auth.ts
interface UserData {
  _id: string;
  role: 'petOwner' | 'doctor';
  token: string;
}

export const setAuthData = (data: UserData): void => {
  localStorage.setItem('userData', JSON.stringify(data));
};

export const removeAuthData = (): void => {
  localStorage.removeItem('userData');
};

export const getUserData = (): UserData | null => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

export const getToken = (): string | null => {
  const userData = getUserData();
  return userData?.token || null;
};

export const isAuthenticated = (): boolean => {
  return !!getUserData();
};

export const hasRole = (role: 'petOwner' | 'doctor'): boolean => {
  const userData = getUserData();
  return userData?.role === role;
};