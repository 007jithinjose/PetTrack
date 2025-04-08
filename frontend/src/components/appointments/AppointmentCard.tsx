import { Appointment, AppointmentStatus } from '@/services/interfaces/appointment.interface';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, PawPrint, Stethoscope, NotebookPen, Check, X } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onConfirm?: (id: string) => void;
  isConfirming?: boolean;
  isRescheduling?: boolean;
  isCancelling?: boolean;
  isDoctorView?: boolean;
  isReadOnly?: boolean;
  className?: string;
  additionalActions?: React.ReactNode;
}

export function AppointmentCard({ 
  appointment, 
  onCancel, 
  onReschedule,
  onConfirm,
  isDoctorView = false,
  isReadOnly = false,
  className = '',
  additionalActions
}: AppointmentCardProps) {
  const statusVariantMap: Record<AppointmentStatus, "secondary" | "default" | "destructive" | "outline"> = {
    [AppointmentStatus.PENDING]: 'secondary',
    [AppointmentStatus.CONFIRMED]: 'default',
    [AppointmentStatus.COMPLETED]: 'outline',
    [AppointmentStatus.CANCELLED]: 'destructive',
    [AppointmentStatus.MISSED]: 'destructive',
    [AppointmentStatus.RESCHEDULED]: 'outline'
  };

  const statusVariant = statusVariantMap[appointment.status];

  const getPetName = () => {
    if (!appointment.pet) return 'Unknown Pet';
    if (typeof appointment.pet === 'string') return appointment.petDetails?.name || 'Unknown Pet';
    return appointment.pet.name || 'Unknown Pet';
  };

  const getDoctorName = () => {
    if (!appointment.doctor) return 'Unknown Doctor';
    if (typeof appointment.doctor === 'string') return appointment.doctorDetails?.name || 'Unknown Doctor';
    return appointment.doctor.name || 'Unknown Doctor';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDoctorImage = () => {
    if (typeof appointment.doctor === 'string') return undefined;
    return appointment.doctor?.image;
  };

  const getDoctorSpecialization = () => {
    if (typeof appointment.doctor === 'string') return '';
    return appointment.doctor?.specialization;
  };

  const getPetDetails = () => {
    if (typeof appointment.pet === 'string') return 'Unknown details';
    return `${appointment.pet?.breed || 'Unknown breed'} • ${appointment.pet?.age || '?'} years old`;
  };

  return (
    <Card className={`w-full max-w-md overflow-hidden transition-all hover:shadow-lg ${className}`}>
      {/* Header with status and date */}
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={getDoctorImage()} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(getDoctorName())}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dr. {getDoctorName()}</p>
              <p className="text-xs text-muted-foreground">{getDoctorSpecialization()}</p>
            </div>
          </div>
          <Badge variant={statusVariant} className="px-3 py-1 rounded-full">
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Main appointment info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {format(new Date(appointment.date), 'MMMM do, yyyy')}
              </span>
            </div>
          </div>

          {/* Pet info */}
          <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <PawPrint className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{getPetName()}</p>
              <p className="text-xs text-muted-foreground">
                {getPetDetails()}
              </p>
            </div>
          </div>

          {/* Reason and notes */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <NotebookPen className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-sm">{appointment.reason}</p>
              </div>
            </div>

            {appointment.notes && (
              <div className="flex items-start gap-2">
                <Stethoscope className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          {/* Show main actions only if not read-only */}
          {!isReadOnly && (
            <div className="flex gap-3">
              {isDoctorView ? (
                <>
                  {appointment.status === AppointmentStatus.PENDING && (
                    <>
                      {onConfirm && (
                        <Button
                          variant="default"
                          className="flex-1 gap-2"
                          onClick={() => onConfirm?.(appointment.id)}
                        >
                          <Check className="h-4 w-4" />
                          Confirm
                        </Button>
                      )}
                      {onCancel && (
                        <Button
                          variant="destructive"
                          className="flex-1 gap-2"
                          onClick={() => onCancel?.(appointment.id)}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </>
                  )}
                  {appointment.status === AppointmentStatus.CONFIRMED && onReschedule && (
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => onReschedule?.(appointment.id)}
                    >
                      <CalendarDays className="h-4 w-4" />
                      Reschedule
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {appointment.status === AppointmentStatus.PENDING && (
                    <>
                      {onReschedule && (
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => onReschedule?.(appointment.id)}
                        >
                          <CalendarDays className="h-4 w-4" />
                          Reschedule
                        </Button>
                      )}
                      {onCancel && (
                        <Button
                          variant="destructive"
                          className="flex-1 gap-2"
                          onClick={() => onCancel?.(appointment.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Always show additional actions if they exist */}
          {additionalActions && (
            <div className="flex gap-3">
              {additionalActions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}