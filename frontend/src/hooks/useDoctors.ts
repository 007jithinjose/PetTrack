//src/hooks/useDoctors.ts
import { useQuery } from '@tanstack/react-query';
import { hospitalService } from '../services/apiService';

export function useDoctors() {
  const { data } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => hospitalService.getHospitalDoctors('hospital-id-here'), // Replace with actual hospital ID
    select: (res) => res.data || [],
  });

  return { doctors: data || [] };
}