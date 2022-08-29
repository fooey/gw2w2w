import { useQuery } from '@tanstack/react-query';
import { Duration } from 'luxon';
import type { ApiMatch, ApiMatchOverview, ApiMatchScores } from '~/types/api';

export const useMatchesOverview = () =>
  useQuery<ApiMatchOverview[]>([`/v2/wvw/matches/overview?ids=all`], {
    cacheTime: Duration.fromObject({ minutes: 60 }).as('milliseconds'),
    staleTime: Duration.fromObject({ minutes: 10 }).as('milliseconds'),
    refetchInterval: Duration.fromObject({ minutes: 1 }).as('milliseconds'),
  });

export const useMatchesScores = () =>
  useQuery<ApiMatchScores[]>([`/v2/wvw/matches/scores?ids=all`], {
    cacheTime: Duration.fromObject({ minutes: 60 }).as('milliseconds'),
    staleTime: Duration.fromObject({ minutes: 5 }).as('milliseconds'),
    refetchInterval: Duration.fromObject({ seconds: 10 }).as('milliseconds'),
  });

export const useMatch = (matchId?: ApiMatch['id']) => {
  return useQuery<ApiMatch>([`/v2/wvw/matches?id=${matchId}`], {
    cacheTime: Duration.fromObject({ minutes: 60 }).as('milliseconds'),
    staleTime: Duration.fromObject({ minutes: 5 }).as('milliseconds'),
    refetchInterval: Duration.fromObject({ seconds: 5 }).as('milliseconds'),
    enabled: matchId !== undefined,
  });
};
export const useWorldMatch = (worldId?: number) => {
  return useQuery<ApiMatch>([`/v2/wvw/matches?world=${worldId}`], {
    cacheTime: Duration.fromObject({ minutes: 60 }).as('milliseconds'),
    staleTime: Duration.fromObject({ minutes: 5 }).as('milliseconds'),
    refetchInterval: Duration.fromObject({ seconds: 5 }).as('milliseconds'),
    enabled: worldId !== undefined,
  });
};

export const useWorldMatchOverview = (worldId?: number) => {
  return useQuery<ApiMatchOverview>([`/v2/wvw/matches/overview?world=${worldId}`], {
    cacheTime: Duration.fromObject({ minutes: 60 }).as('milliseconds'),
    staleTime: Duration.fromObject({ minutes: 10 }).as('milliseconds'),
    refetchInterval: Duration.fromObject({ minutes: 1 }).as('milliseconds'),
    enabled: worldId !== undefined,
  });
};
