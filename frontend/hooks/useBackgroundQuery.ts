import { useQuery } from '@tanstack/react-query';
import type { WeatherTheme } from '@/shared/weatherTheme';

async function fetchBackground(theme: WeatherTheme): Promise<string | null> {
  const response = await fetch(`/api/background?condition=${theme}`);
  const body = await response.json();
  return body.url ?? null;
}

export function useBackgroundQuery(theme: WeatherTheme) {
  return useQuery({
    queryKey: ['background', theme],
    queryFn: () => fetchBackground(theme),
    staleTime: 3_600_000
  });
}
