import { useQuery } from '@tanstack/react-query';
import { Duration } from 'luxon';
import { ApiWorld } from '~/types/api';
import { useLang } from '~/utils/langs';

export const useWvwObjectives = () => {
  const lang = useLang();
  return useQuery<ApiWorld[]>([`/wvw/objectives?lang=${lang}&ids=all`], {
    cacheTime: Duration.fromObject({ days: 1 }).as('milliseconds'),
    staleTime: Duration.fromObject({ hour: 1 }).as('milliseconds'),
  });
};
