import { QueryFunction, QueryKey } from '@tanstack/react-query';
import { Duration } from 'luxon';
import { gw2api } from '~/utils/api';

export const DURATION_MONTH = Duration.fromObject({ month: 1 }).as('milliseconds');
export const DURATION_WEEK = Duration.fromObject({ week: 1 }).as('milliseconds');
export const DURATION_DAY = Duration.fromObject({ day: 1 }).as('milliseconds');
export const DURATION_HOUR = Duration.fromObject({ hour: 1 }).as('milliseconds');
export const DURATION_MINUTE = Duration.fromObject({ minute: 1 }).as('milliseconds');
export const DURATION_SECOND = Duration.fromObject({ second: 1 }).as('milliseconds');

export const QUERY_STATIC = {
  cacheTime: DURATION_WEEK,
  staleTime: DURATION_DAY,
};

export const QUERY_STABLE = {
  cacheTime: DURATION_DAY,
  staleTime: DURATION_HOUR,
};

export const QUERY_LIVE = {
  cacheTime: DURATION_HOUR,
  staleTime: DURATION_MINUTE * 10,
  refetchInterval: DURATION_MINUTE,
};

export const QUERY_REALTIME = {
  cacheTime: DURATION_MINUTE * 10,
  staleTime: DURATION_MINUTE,
  refetchInterval: DURATION_SECOND * 5,
};

export const defaultQueryFn: QueryFunction<unknown, QueryKey> = async ({ queryKey }) => {
  const { data } = await gw2api.get(`${queryKey[0]}`);
  return data;
};
