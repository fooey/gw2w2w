import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { Duration } from 'luxon';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MatchOverviewsContainer } from '~/containers/index/Index';
import { World } from '~/containers/world/World';
import { defaultQueryFn } from '~/queries/defaultQueryFn';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      cacheTime: Duration.fromObject({ hours: 24 }).as('milliseconds'),
    },
  },
});

const localStoragePersister = createSyncStoragePersister({ storage: window.localStorage });
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route index element={<MatchOverviewsContainer />} />
          <Route path="world/:worldName" element={<World />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
