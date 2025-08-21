// src/pages/DoctorAppointmentsPage.tsx
import { DoctorAppointments } from '@/components/appointments/DoctorAppointments';
import { Link } from 'react-router-dom';

export function DoctorAppointmentsPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        {/* <Link to="/doctor/appointments/records" className="text-sm font-medium">
          View All Records
        </Link> */}
      </div>
      <DoctorAppointments />
    </div>
  );
}