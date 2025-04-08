// File: src/components/medical/MedicalRecordCard.tsx
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { MedicalRecordResponse } from '@/services/interfaces';

interface MedicalRecordCardProps {
  record: MedicalRecordResponse;
  onEdit?: (id: string) => void;
  className?: string;
}

export function MedicalRecordCard({ record, onEdit, className = '' }: MedicalRecordCardProps) {
  return (
    <Card className={`p-4 mb-4 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{record.diagnosis}</h3>
        <div className="text-sm text-gray-500">
          {format(new Date(record.date), 'MMM dd, yyyy')}
        </div>
      </div>
      
      <div className="text-sm mb-2">
        <span className="font-medium">Doctor:</span> {record.doctor.name}
      </div>
      
      <div className="mb-2">
        <h4 className="text-sm font-medium mb-1">Symptoms</h4>
        <div className="flex flex-wrap gap-1">
          {record.symptoms.map((symptom, index) => (
            <Badge key={index} variant="outline">
              {symptom}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="mb-2">
        <h4 className="text-sm font-medium mb-1">Treatment</h4>
        <ul className="list-disc pl-5 text-sm">
          {record.treatment.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      
      {record.prescribedMedications && record.prescribedMedications.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm font-medium mb-1">Medications</h4>
          <ul className="list-disc pl-5 text-sm">
            {record.prescribedMedications.map((med, index) => (
              <li key={index}>{med}</li>
            ))}
          </ul>
        </div>
      )}
      
      {record.notes && (
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-1">Notes</h4>
          <p className="text-sm">{record.notes}</p>
        </div>
      )}
      
      {onEdit && (
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => onEdit(record._id)}
            className="text-sm text-primary hover:underline"
          >
            Edit Record
          </button>
        </div>
      )}
    </Card>
  );
}