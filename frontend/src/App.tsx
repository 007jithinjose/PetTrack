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
import { AppointmentBooking } from './pages/AppointmentBooking';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DoctorAppointmentsPage } from './pages/DoctorAppointmentsPage';

// src/App.tsx
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/*" element={<AuthPage />} />
          
          {/* Protected routes with dashboard layout */}
          <Route element={<AuthWrapper><DashboardLayout /></AuthWrapper>}>
            {/* Pet Owner routes */}
            <Route path="/owner" element={<PetOwnerDashboard />} />
            
            {/* Doctor routes */}
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
            
            {/* Pet management routes */}
            <Route path="/pets" element={<PetManagement />} />
            <Route path="/pets/new" element={<PetFormPage />} />
            <Route path="/pets/:id" element={<PetDetailPage />} />
            <Route path="/pets/:id/edit" element={<EditPetPage />} />
            
            {/* Appointment routes */}
            <Route path="/appointments" element={<AppointmentBooking />} />
            <Route path="/appointments/new" element={<AppointmentBooking />} />
          </Route>
          
          {/* 404 Not Found */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;