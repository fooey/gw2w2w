import { useQueries, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { find, keyBy, keys, reduce, some } from 'lodash';
import { ApiLang, ApiRegions, ApiWorld } from '~/types/api';
import { langs } from '~/utils/langs';
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
  names: string[];
};

type LangDict = Record<ApiLang, Record<number, ApiWorld>>;

type WorldsByLang = Record<ApiLang, Record<number, ApiWorld>>;

const worldsByLangInit: WorldsByLang = Object.freeze({
  en: {},
  es: {},
  de: {},
  fr: {},
  zh: {},
});

const useWorldsQueries = () =>
  useQueries({
    queries: langs.map((lang) => {
      const queryOptions: UseQueryOptions<ApiWorld[]> = {
        ...QUERY_STATIC,
        queryKey: [`/v2/worlds?lang=${lang}&ids=all`],
      };

      return queryOptions;
    }),
  });

export const useWorlds = () => {
  const worldsQueries = useWorldsQueries();

  let data: WorldDict | undefined = undefined;

  const isLoading = some(worldsQueries, 'isLoading');
  const isError = some(worldsQueries, 'isError');
  const isFetched = some(worldsQueries, 'isFetched');

  if (!isLoading) {
    data = buildWorldDict(worldsQueries);
  }

  return { data, isLoading, isError, isFetched };
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

  if (worldName && worlds.isFetched && worlds.data)
    data = find(worlds.data, ({ names: all }) => all.includes(worldName));

  return { ...worlds, data };
};

const buildWorldDict = (worldsQueries: UseQueryResult<ApiWorld[], unknown>[]): WorldDict => {
  let data: WorldDict | undefined = undefined;

  const worldsByLang: WorldsByLang = langs.reduce((acc, lang, index) => {
    const langWordsById = keyBy(worldsQueries[index].data, 'id');

    return {
      ...acc,
      [lang]: langWordsById,
    };
  }, worldsByLangInit);

  const worldIds = keys(worldsByLang['en']);

  data = reduce(
    worldIds,
    (acc, id) => {
      const [region] = id[0];
      const idNum = Number(id);
      const init: Partial<WorldDictItem> & { names: string[] } = {
        names: [],
      };
      const worldLangs = langs.reduce((acc, lang: ApiLang) => {
        const name = worldsByLang[lang][idNum].name;

        return {
          ...acc,
          names: [...acc.names, name],
          [lang]: name,
        };
      }, init);

      const worldAgg: WorldDictItem = {
        id: idNum,
        region: region as ApiRegions,
        ...worldLangs,
      } as WorldDictItem;

      return {
        ...acc,
        [id]: worldAgg,
      };
    },
    {}
  );

  return data;
};
