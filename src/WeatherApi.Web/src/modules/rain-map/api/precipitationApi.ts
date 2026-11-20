import { useQuery } from '@tanstack/react-query';
import { getJson } from '../../../shared/lib/apiClient';
import type { CurrentPrecipitationResponse } from '../types';

export function useCurrentPrecipitation(latitude: number, longitude: number, enabled: boolean) {
  return useQuery({
    queryKey: ['current-precipitation', latitude, longitude],
    queryFn: () => getJson<CurrentPrecipitationResponse>('/api/precipitation/current', { latitude, longitude }),
    enabled,
  });
}
