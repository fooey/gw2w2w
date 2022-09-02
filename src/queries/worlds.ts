import { useQuery } from '@tanstack/react-query';
import { find, keyBy, keys, reduce } from 'lodash';
import { ApiRegions, ApiWorld } from '~/types/api';
import { QUERY_STATIC } from './config';

export type WorldDict = Record<number, WorldDictItem>;
export type WorldDictItem = {
  id: number;
  region: ApiRegions;
  en: string;
  es: string;
  de: string;
  fr: string;
  zh: string;
};

export const useWorlds = () => {
  const enWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=en&ids=all`], QUERY_STATIC);
  const esWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=es&ids=all`], QUERY_STATIC);
  const deWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=de&ids=all`], QUERY_STATIC);
  const frWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=fr&ids=all`], QUERY_STATIC);
  const zhWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=zh&ids=all`], QUERY_STATIC);

  let data: WorldDict | undefined = undefined;

  const isLoading =
    enWorldsQuery.isLoading ||
    esWorldsQuery.isLoading ||
    deWorldsQuery.isLoading ||
    frWorldsQuery.isLoading ||
    zhWorldsQuery.isLoading;

  if (!isLoading) {
    const enWorlds = keyBy(enWorldsQuery.data, 'id');
    const esWorlds = keyBy(esWorldsQuery.data, 'id');
    const deWorlds = keyBy(deWorldsQuery.data, 'id');
    const frWorlds = keyBy(frWorldsQuery.data, 'id');
    const zhWorlds = keyBy(zhWorldsQuery.data, 'id');

    const worldIds = keys(enWorlds);

    data = reduce(
      worldIds,
      (acc, id) => {
        const [region] = id[0];
        const worldAgg: WorldDictItem = {
          id: Number(id),
          region: region as ApiRegions,
          en: enWorlds[id].name,
          es: esWorlds[id].name,
          de: deWorlds[id].name,
          fr: frWorlds[id].name,
          zh: zhWorlds[id].name,
        };
        return {
          ...acc,
          [id]: worldAgg,
        };
      },
      {}
    );
  }

  return { data, isLoading };
};

export const useWorld = (worldId?: number) => {
  const worlds = useWorlds();

  let data: WorldDictItem | undefined = undefined;

  if (worldId && worlds.data) data = worlds.data[worldId];

  return { ...worlds, data };
};

export const useWorldByName = (worldName?: string) => {
  const worlds = useWorlds();

  let data: WorldDictItem | undefined = undefined;

  if (worldName && worlds.data)
    data = find(worlds.data, ({ en, es, de, fr, zh }) => [en, es, de, fr, zh].includes(worldName));

  return { ...worlds, data };
};
