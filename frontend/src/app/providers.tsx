import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { system } from '../theme';
import { ToasterComponent } from '../shared/components/ToasterComponent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Composes all application-level providers:
 * 1. ChakraProvider — UI theming and CSS reset
 * 2. QueryClientProvider — server state caching (TanStack Query)
 * 3. BrowserRouter — client-side routing
 * 4. ToasterComponent — renders toast notifications
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ChakraProvider value={system}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
      <ToasterComponent />
    </ChakraProvider>
  );
}
