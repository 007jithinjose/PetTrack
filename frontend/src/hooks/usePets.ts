//src/hooks/usePets.ts
import { useQuery } from '@tanstack/react-query';
import { petService } from '../services/apiService';

export function usePets() {
  const { data } = useQuery({
    queryKey: ['pets'],
    queryFn: () => petService.getPets(),
    select: (res) => res.data || [],
  });

  return { pets: data || [] };
}