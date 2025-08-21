// src/components/appointments/DoctorAppointments.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Appointment,
  AppointmentQueryParams,
  QueryableAppointmentStatus,
  PaginatedAppointments,
} from "@/services/interfaces/appointment.interface";
import { AppointmentCard } from "./AppointmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { appointmentService } from "@/services/apiService";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { FileText, PlusCircle } from "lucide-react";

export function DoctorAppointments() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedStatus, setSelectedStatus] =
    useState<QueryableAppointmentStatus>("pending");
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newAppointmentDate, setNewAppointmentDate] = useState<
    Date | undefined
  >();

  // Fetch doctor's appointments (without filtering by status initially)
  const {
    data: allAppointmentsData,
    isLoading,
    isError,
    refetch,
  } = useQuery<PaginatedAppointments>({
    queryKey: ["doctor-appointments", selectedDate], // Remove selectedStatus from the query key
    queryFn: async () => {
      const params: AppointmentQueryParams = {}; // Fetch all statuses

      if (selectedDate) {
        params.startDate = selectedDate.toISOString();
        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
        params.endDate = endDate.toISOString();
      }

      try {
        const response = await appointmentService.getDoctorAppointments(params);
        if (!response) {
          throw new Error("No data returned from API");
        }
        return response;
      } catch (error) {
        console.error("Error fetching appointments:", error);
        throw new Error("Failed to fetch appointments");
      }
    },
  });

  // Extract all appointments
  const allAppointments = useMemo(() => {
    return (
      (allAppointmentsData as PaginatedAppointments | undefined)?.data || []
    );
  }, [allAppointmentsData]);

  // Filter appointments by date
  const filteredAppointments = useMemo(() => {
    return selectedDate
      ? allAppointments.filter(
          (appt: Appointment) =>
            format(new Date(appt.date), "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd")
        )
      : allAppointments;
  }, [allAppointments, selectedDate]);

  // Calculate stats based on the *date-filtered* appointments
  const stats = useMemo(() => {
    return {
      pending: filteredAppointments.filter(
        (appt: Appointment) => appt.status === "pending"
      ).length,
      confirmed: filteredAppointments.filter(
        (appt: Appointment) => appt.status === "confirmed"
      ).length,
      completed: filteredAppointments.filter(
        (appt: Appointment) => appt.status === "completed"
      ).length,
      cancelled: filteredAppointments.filter(
        (appt: Appointment) => appt.status === "cancelled"
      ).length,
    };
  }, [filteredAppointments]);

  // Filter appointments for the active tab
  const visibleAppointments = useMemo(() => {
    return filteredAppointments.filter(
      (appt: Appointment) => appt.status === selectedStatus
    );
  }, [filteredAppointments, selectedStatus]);

  // Mutation for confirming appointment with optimistic updates
  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      return appointmentService.confirmAppointment(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["doctor-appointments", selectedDate],
      });
      const previousData = queryClient.getQueryData<PaginatedAppointments>([
        "doctor-appointments",
        selectedDate,
      ]);

      queryClient.setQueryData(
        ["doctor-appointments", selectedDate],
        (old: PaginatedAppointments | undefined) => ({
          ...old,
          data:
            old?.data?.map((appt: Appointment) =>
              appt.id === id ? { ...appt, status: "confirmed" } : appt
            ) || [],
        })
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success("Appointment confirmed successfully!");
    },
    onError: (
      err: Error,
      id: string,
      context: { previousData?: PaginatedAppointments } | undefined
    ) => {
      toast.error(err.message || "Failed to confirm appointment");
      if (context?.previousData) {
        queryClient.setQueryData(
          ["doctor-appointments", selectedDate],
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["doctor-appointments", selectedDate],
      });
    },
  });

  // Mutation for cancelling appointment with optimistic updates
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return appointmentService.cancelAppointment(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["doctor-appointments", selectedDate],
      });
      const previousData = queryClient.getQueryData<PaginatedAppointments>([
        "doctor-appointments",
        selectedDate,
      ]);

      queryClient.setQueryData(
        ["doctor-appointments", selectedDate],
        (old: PaginatedAppointments | undefined) => ({
          ...old,
          data:
            old?.data?.map((appt: Appointment) =>
              appt.id === id ? { ...appt, status: "cancelled" } : appt
            ) || [],
        })
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success("Appointment cancelled successfully!");
    },
    onError: (
      err: Error,
      id: string,
      context: { previousData?: PaginatedAppointments } | undefined
    ) => {
      toast.error(err.message || "Failed to cancel appointment");
      if (context?.previousData) {
        queryClient.setQueryData(
          ["doctor-appointments", selectedDate],
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["doctor-appointments", selectedDate],
      });
    },
  });

  // Mutation for rescheduling appointment with optimistic updates
  const rescheduleMutation = useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      return appointmentService.rescheduleAppointment(id, date);
    },
    onMutate: async ({ id, date }) => {
      await queryClient.cancelQueries({
        queryKey: ["doctor-appointments", selectedDate],
      });
      const previousData = queryClient.getQueryData<PaginatedAppointments>([
        "doctor-appointments",
        selectedDate,
      ]);

      queryClient.setQueryData(
        ["doctor-appointments", selectedDate],
        (old: PaginatedAppointments | undefined) => ({
          ...old,
          data:
            old?.data?.map((appt: Appointment) =>
              appt.id === id ? { ...appt, date } : appt
            ) || [],
        })
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success("Appointment rescheduled successfully!");
      setReschedulingId(null);
      setNewAppointmentDate(undefined);
    },
    onError: (
      err: Error,
      variables: { id: string; date: string },
      context: { previousData?: PaginatedAppointments } | undefined
    ) => {
      toast.error(err.message || "Failed to reschedule appointment");
      if (context?.previousData) {
        queryClient.setQueryData(
          ["doctor-appointments", selectedDate],
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["doctor-appointments", selectedDate],
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Failed to load appointments.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reschedule Modal */}
      <Dialog
        open={!!reschedulingId}
        onOpenChange={() => setReschedulingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={newAppointmentDate}
              onSelect={setNewAppointmentDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
            <Button
              onClick={() => {
                if (newAppointmentDate && reschedulingId) {
                  rescheduleMutation.mutate({
                    id: reschedulingId,
                    date: newAppointmentDate.toISOString(),
                  });
                }
              }}
              disabled={!newAppointmentDate || rescheduleMutation.isPending}
            >
              {rescheduleMutation.isPending
                ? "Rescheduling..."
                : "Confirm Reschedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {" "}
        {/* Changed to grid-cols-4 to include cancelled */}
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
          <p className="text-2xl font-bold">{stats.confirmed}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
          <p className="text-2xl font-bold">{stats.cancelled}</p>
        </div>
      </div>

      {/* Date Picker */}
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
        {selectedDate && (
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => setSelectedDate(undefined)}
          >
            Clear date filter
          </Button>
        )}
      </div>

      {/* Appointments List */}
      <Tabs
        value={selectedStatus}
        onValueChange={(value) =>
          setSelectedStatus(value as QueryableAppointmentStatus)
        }
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {visibleAppointments.map((appointment: Appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isDoctorView
                onConfirm={() => confirmMutation.mutate(appointment.id)}
                onCancel={() => cancelMutation.mutate(appointment.id)}
                onReschedule={() => setReschedulingId(appointment.id)}
                isConfirming={
                  confirmMutation.isPending &&
                  confirmMutation.variables === appointment.id
                }
                isCancelling={
                  cancelMutation.isPending &&
                  cancelMutation.variables === appointment.id
                }
              />
            ))}
            {visibleAppointments.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">
                No pending appointments
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="confirmed">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {visibleAppointments.map((appointment: Appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isDoctorView
                onReschedule={() => setReschedulingId(appointment.id)}
                isRescheduling={
                  rescheduleMutation.isPending &&
                  rescheduleMutation.variables?.id === appointment.id
                }
                additionalActions={
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/doctor/appointments/${appointment.id}/records`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Records
                    </Link>
                  </Button>
                }
              />
            ))}
            {visibleAppointments.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">
                No confirmed appointments
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {visibleAppointments.map((appointment: Appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isDoctorView
                isReadOnly
                additionalActions={
                  <div className="flex gap-2 w-full">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Link
                        to={`/doctor/appointments/${appointment.id}/records`}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Records
                      </Link>
                    </Button>
                  </div>
                }
              />
            ))}
            {visibleAppointments.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">
                No completed appointments
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
