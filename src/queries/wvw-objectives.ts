import { useQuery } from '@tanstack/react-query';
import { find } from 'lodash';
import { Duration } from 'luxon';
import type { ApiWvwObjective } from '~/types/api';
import { useLang } from '~/utils/langs';

export const useWvwObjectives = () => {
  const lang = useLang();
  return useQuery<ApiWvwObjective[]>([`/v2/wvw/objectives?lang=${lang}&ids=all`], {
    cacheTime: Duration.fromObject({ days: 1 }).as('milliseconds'),
    staleTime: Duration.fromObject({ hour: 1 }).as('milliseconds'),
  });
};

export const useWvwObjective = (objectiveId?: string) => {
  const objectivesQuery = useWvwObjectives();
  let data: ApiWvwObjective | undefined;

  if (objectivesQuery.data) {
    data = find(objectivesQuery.data, { id: objectiveId });
  }

  return {
    ...objectivesQuery,
    data,
  };
};
