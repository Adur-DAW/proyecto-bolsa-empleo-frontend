import { QueryClient } from '@tanstack/react-query';

export const queryClientConfig = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  },
});
