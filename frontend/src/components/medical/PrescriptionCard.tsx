// File: src/components/medical/PrescriptionCard.tsx
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from '@radix-ui/react-icons';
import { PrescriptionResponse } from '@/services/interfaces';

interface PrescriptionCardProps {
  prescription: PrescriptionResponse;
  onDownload: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function PrescriptionCard({ prescription, onDownload, onEdit }: PrescriptionCardProps) {
  return (
    <Card className="p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">Prescription</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {format(new Date(prescription.date), 'MMM dd, yyyy')}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDownload(prescription._id)}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="text-sm mb-2">
        <span className="font-medium">Doctor:</span> {prescription.doctor.name}
      </div>
      
      <div className="mb-2">
        <h4 className="text-sm font-medium mb-1">Medications</h4>
        <ul className="list-disc pl-5 text-sm">
          {prescription.medications.map((med, index) => (
            <li key={index}>
              <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency} for {med.duration}
            </li>
          ))}
        </ul>
      </div>
      
      {prescription.instructions && (
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-1">Instructions</h4>
          <p className="text-sm">{prescription.instructions}</p>
        </div>
      )}
      
      {onEdit && (
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => onEdit(prescription._id)}
            className="text-sm text-primary hover:underline"
          >
            Edit Prescription
          </button>
        </div>
      )}
    </Card>
  );
}