// File: src/components/appointments/CalendarView.tsx
import { Calendar } from '../ui/calendar';
import { Appointment } from '../../services/interfaces/appointment.interface';
import { isSameDay } from 'date-fns';

interface CalendarViewProps {
  appointments: Appointment[];
  selectedDate?: Date;
  onSelectDate: (date?: Date) => void;
}

export function CalendarView({ appointments, selectedDate, onSelectDate }: CalendarViewProps) {
  const dateHasAppointment = (date: Date) => {
    return appointments.some(appt => isSameDay(new Date(appt.date), date));
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          modifiers={{
            hasAppointment: dateHasAppointment,
          }}
          modifiersStyles={{
            hasAppointment: {
              border: '2px solid #3b82f6',
              borderRadius: '6px'
            },
          }}
          className="w-full"
          classNames={{
            root: 'w-full',
            month: 'w-full',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-xl font-semibold',
            nav: 'flex items-center space-x-4',
            nav_button: 'h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full border',
            nav_button_previous: 'absolute left-4',
            nav_button_next: 'absolute right-4',
            table: 'w-full border-collapse mt-4',
            head_row: 'w-full flex justify-between',
            head_cell: 'text-muted-foreground rounded-md w-14 h-10 font-medium text-sm flex items-center justify-center',
            row: 'w-full flex justify-between mt-2',
            cell: 'h-14 w-14 p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: 'w-full h-full flex items-center justify-center p-0 font-medium text-base aria-selected:opacity-100 rounded-md',
            day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            day_today: 'bg-accent text-accent-foreground',
            day_outside: 'text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible'
          }}
        />
      </div>
    </div>
  );
}