import { useQuery } from '@tanstack/react-query';
import type { ApiMatch, ApiMatchOverview, ApiMatchScores } from '~/types/api';
import { QUERY_LIVE, QUERY_REALTIME } from './config';

export const useMatchesOverview = () =>
  useQuery<ApiMatchOverview[]>({
    ...QUERY_LIVE,
    queryKey: [`/v2/wvw/matches/overview?ids=all`],
  });

export const useMatchesScores = () =>
  useQuery<ApiMatchScores[]>({
    ...QUERY_REALTIME,
    queryKey: [`/v2/wvw/matches/scores?ids=all`],
  });

export const useMatch = (matchId?: ApiMatch['id']) => {
  return useQuery<ApiMatch>({
    ...QUERY_REALTIME,
    queryKey: [`/v2/wvw/matches?id=${matchId}`],
    enabled: matchId !== undefined,
  });
};

export const useWorldMatch = (worldId?: number) => {
  return useQuery<ApiMatch>({
    ...QUERY_REALTIME,
    queryKey: [`/v2/wvw/matches?world=${worldId}`],
    enabled: worldId !== undefined,
  });
};

export const useWorldMatchOverview = (worldId?: number) => {
  return useQuery<ApiMatchOverview>({
    queryKey: [`/v2/wvw/matches/overview?world=${worldId}`],
    ...QUERY_LIVE,
    enabled: worldId !== undefined,
  });
};
