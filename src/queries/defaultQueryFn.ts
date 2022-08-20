import { QueryFunction, QueryKey } from '@tanstack/react-query';
import { gw2api } from '~/utils/api';

export const defaultQueryFn: QueryFunction<unknown, QueryKey> = async ({ queryKey }) => {
  const { data } = await gw2api.get(`${queryKey[0]}`);
  return data;
};
