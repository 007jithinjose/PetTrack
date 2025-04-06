// src/pages/DoctorAppointments.tsx
import { DoctorAppointments } from '@/components/appointments/DoctorAppointments';

export function DoctorAppointmentsPage() {
  return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
        <DoctorAppointments />
      </div>
  );
}