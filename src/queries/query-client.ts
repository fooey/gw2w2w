import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { Duration } from 'luxon';
import { defaultQueryFn } from '~/queries/config';

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
