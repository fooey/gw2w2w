import { useQuery } from '@tanstack/react-query';
import { find, keyBy, keys, reduce } from 'lodash';
import { Duration } from 'luxon';
import { ApiWorld } from '~/types/api';

export type WorldDict = Record<number, WorldDictItem>;
export type WorldDictItem = {
  id: number;
  en: string;
  es: string;
  de: string;
  fr: string;
  zh: string;
};

const useWorldsQueryOptions = {
  cacheTime: Duration.fromObject({ days: 1 }).as('milliseconds'),
  staleTime: Duration.fromObject({ hour: 1 }).as('milliseconds'),
};

export const useWorlds = () => {
  const enWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=en&ids=all`], useWorldsQueryOptions);
  const esWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=es&ids=all`], useWorldsQueryOptions);
  const deWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=de&ids=all`], useWorldsQueryOptions);
  const frWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=fr&ids=all`], useWorldsQueryOptions);
  const zhWorldsQuery = useQuery<ApiWorld[]>([`/v2/worlds?lang=zh&ids=all`], useWorldsQueryOptions);

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
        const worldAgg: WorldDictItem = {
          id: Number(id),
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
