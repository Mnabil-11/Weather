'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 600_000,
        gcTime: 1_800_000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3
      }
    }
  }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
