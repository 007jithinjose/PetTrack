// File: src/pages/DoctorAppointmentRecordsPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { appointmentService, medicalService } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalRecordForm } from "@/components/medical/MedicalRecordForm";
import { useCreateMedicalRecord } from "@/hooks/useMedicalRecords";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MedicalRecordCard } from "@/components/medical/MedicalRecordCard";
import { PrescriptionForm } from "@/components/medical/PrescriptionForm";
import { useCreatePrescription } from "@/hooks/usePrescriptions";
import { MedicalRecordResponse } from "@/services/interfaces";
import { toast } from "sonner";

export function DoctorAppointmentRecordsPage() {
  const { id: appointmentId } = useParams<{ id: string }>();
  const [isMedicalDialogOpen, setIsMedicalDialogOpen] = useState(false);
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);

  const {
    data: appointment,
    isLoading,
    error: appointmentError,
  } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => appointmentService.getAppointmentById(appointmentId || ""),
    enabled: !!appointmentId,
  });

  const {
    data: records,
    isLoading: isLoadingRecords,
    error: recordsError,
  } = useQuery({
    queryKey: ["appointment-records", appointmentId],
    queryFn: () => medicalService.getAppointmentRecords(appointmentId || ""),
    enabled: !!appointmentId,
  });

  const petId = typeof appointment?.data?.pet === "object" && appointment?.data?.pet?._id ? appointment.data.pet._id : undefined;

  const { mutate: createRecord, isPending: isCreatingRecord } = 
    useCreateMedicalRecord(petId || "");

  const { mutate: createPrescription, isPending: isCreatingPrescription } =
    useCreatePrescription(petId || "");

  const handleCreateRecord = (values: any) => {
    createRecord(values, {
      onSuccess: () => {
        setIsMedicalDialogOpen(false);
        toast.success("Medical record created successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create medical record');
      }
    });
  };

  const handleCreatePrescription = (values: any) => {
    createPrescription(values, {
      onSuccess: () => {
        setIsPrescriptionDialogOpen(false);
        toast.success("Prescription created successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create prescription');
      }
    });
  };

  if (isLoading || isLoadingRecords) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (appointmentError) {
    return <div>Error loading appointment</div>;
  }

  if (recordsError) {
    return <div>Error loading records</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Records for Appointment on{" "}
          {appointment.data?.date
            ? new Date(appointment.data.date).toLocaleDateString()
            : "Unknown Date"}
        </h2>
        <div className="flex gap-2">
          {/* <Dialog
            open={isPrescriptionDialogOpen}
            onOpenChange={setIsPrescriptionDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Prescription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Prescription</DialogTitle>
              </DialogHeader>
              <PrescriptionForm
                onSubmit={handleCreatePrescription}
                isLoading={isCreatingPrescription}
              />
            </DialogContent>
          </Dialog> */}

          <Dialog
            open={isMedicalDialogOpen}
            onOpenChange={setIsMedicalDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95vw] h-[95dvh]">
              <MedicalRecordForm
                onSubmit={handleCreateRecord}
                isLoading={isCreatingRecord}
                appointmentId={appointmentId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {(records?.data ?? []).length > 0 ? (
        <div className="space-y-4">
          {records.data.map((record: MedicalRecordResponse) => (
            <MedicalRecordCard key={record._id} record={record} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No medical records found for this appointment
          </p>
        </div>
      )}
    </div>
  );
}