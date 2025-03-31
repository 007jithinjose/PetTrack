// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PetOwnerDashboard } from './pages/PetOwnerDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { PetManagement } from './pages/PetManagement';
import { PetDetailPage } from './pages/PetDetailPage';
import { PetFormPage } from './pages/PetFormPage';
import { EditPetPage } from './pages/EditPetPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/*" element={<AuthPage />} />
          
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
          
          {/* Pet routes */}
          <Route path="/pets" element={
            <AuthWrapper requiredRole="petowner">
              <PetManagement />
            </AuthWrapper>
          } />
          
          <Route path="/pets/new" element={
            <AuthWrapper requiredRole="petowner">
              <PetFormPage />
            </AuthWrapper>
          } />
          
          <Route path="/pets/:id" element={
            <AuthWrapper requiredRole="petowner">
              <PetDetailPage />
            </AuthWrapper>
          } />
          
          <Route path="/pets/:id/edit" element={
            <AuthWrapper requiredRole="petowner">
              <EditPetPage />
            </AuthWrapper>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </>
  );
}

export default App;