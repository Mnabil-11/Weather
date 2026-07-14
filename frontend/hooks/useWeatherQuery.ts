import { useQuery } from '@tanstack/react-query';
import { weatherClient } from '@/frontend/lib/weatherClient';

export function useWeatherQuery(query: string) {
  return useQuery({
    queryKey: ['weather', query],
    queryFn: () => weatherClient.get(query),
    enabled: query.trim().length > 0
  });
}
