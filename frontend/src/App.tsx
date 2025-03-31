// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PetOwnerDashboard } from './pages/PetOwnerDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/*" element={<AuthPage />} />
          
          {/* Use lowercase role names */}
          <Route path="/owner" element={
            <AuthWrapper requiredRole="petowner">
              <PetOwnerDashboard />
            </AuthWrapper>
          } />
          
          <Route path="/doctor" element={
            <AuthWrapper requiredRole="doctor">
              <DoctorDashboard />
            </AuthWrapper>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </>
  );
}

export default App;