import { QueryFunction, QueryKey, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Duration } from 'luxon';
import { ApiLang, ApiWorld } from '../types/api';

// const { API_KEY } = import.meta.env;

export const gw2api = axios.create({
  baseURL: `https://api.guildwars2.com`,
  // headers: {
  //   ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
  //   'User-Agent': 'guilds.gw2w2w.com',
  // },
});

// Define a default query function that will receive the query key
export const defaultQueryFn: QueryFunction<unknown, QueryKey> = async ({ queryKey }) => {
  const { data } = await axios.get(`https://api.guildwars2.com${queryKey[0]}`);
  return data;
};

// const fetchWorlds = (): Promise<IApiWorld[]> =>
//   axios.get(`https://api.guildwars2.com/v2/worlds?ids=all`).then((response) => response.data);

// const fetchWorld = (worldId: number): Promise<IApiWorld> =>
//   axios.get(`https://api.guildwars2.com/v2/worlds?id=${worldId}`).then((response) => response.data);

export const useWorlds = (lang: ApiLang = 'en') =>
  useQuery<ApiWorld[]>([`/v2/worlds?lang=${lang}&ids=all`], {
    cacheTime: Duration.fromObject({ days: 1 }).as('milliseconds'),
    staleTime: Duration.fromObject({ hour: 1 }).as('milliseconds'),
  });

export const useWorld = (lang: ApiLang = 'en', worldId: number) =>
  useQuery<ApiWorld>([`/v2/worlds?lang=${lang}&ids=${worldId}`], {
    cacheTime: Duration.fromObject({ days: 1 }).as('milliseconds'),
    staleTime: Duration.fromObject({ hour: 1 }).as('milliseconds'),
  });

export const useWvwObjectives = (lang: ApiLang = 'en') =>
  useQuery<ApiWorld[]>([`/wvw/objectives?lang=${lang}&ids=all`], {
    cacheTime: Duration.fromObject({ days: 1 }).as('milliseconds'),
    staleTime: Duration.fromObject({ hour: 1 }).as('milliseconds'),
  });
