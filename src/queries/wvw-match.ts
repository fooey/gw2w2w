import { useQuery } from '@tanstack/react-query';
import { Duration } from 'luxon';
import { ApiMatch } from '~/types/api';

export const useWorldmatch = (worldId?: number) => {
  return useQuery<ApiMatch>([`/v2/wvw/matches?world=${worldId}`], {
    cacheTime: Duration.fromObject({ minutes: 60 }).as('milliseconds'),
    staleTime: Duration.fromObject({ minutes: 5 }).as('milliseconds'),
    refetchInterval: Duration.fromObject({ seconds: 3 }).as('milliseconds'),
    enabled: worldId !== undefined,
  });
};
