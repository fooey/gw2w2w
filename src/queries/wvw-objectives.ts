import { useQuery } from '@tanstack/react-query';
import { find } from 'lodash';
import type { ApiWvwObjective } from '~/types/api';
import { useLang } from '~/utils/langs';
import { QUERY_STATIC } from './config';

export const useWvwObjectives = () => {
  const lang = useLang();
  return useQuery<ApiWvwObjective[]>([`/v2/wvw/objectives?lang=${lang}&ids=all`], {
    ...QUERY_STATIC,
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
