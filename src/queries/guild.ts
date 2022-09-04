import { useQueries, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useLang } from '~/utils/langs';
import { QUERY_STABLE, QUERY_STATIC } from './config';

/*
  id (string) - The unique guild id.
  name (string) - The guild's name.
  tag (string) - The 2 to 4 letter guild tag representing the guild.
  emblem (object) - The guild emblem (see below). Possible values:
      background (object) - An array containing information of the background of the guild emblem.
          id (number) - The background id, to be resolved against /v2/emblem/backgrounds
          colors (array of numbers) - An array of numbers containing the id of each color used.
      foreground (object) - An array containing information of the foreground of the guild emblem.
          id (number) - The background id, to be resolved against /v2/emblem/foregrounds
          colors (array of numbers) - An array of numbers containing the id of each color used.
      flags (array of strings) - An array containing the manipulations applied to the logo. Possible values:
          FlipBackgroundHorizontal (string)
          FlipBackgroundVertical (string)
*/
interface ApiGuild {
  id: string;
  name: string;
  tag: string;
  emblem: unknown;
}

export const useGuild = (guildId: string) => {
  const guildQuery = useQuery<ApiGuild>({
    ...QUERY_STABLE,
    queryKey: [`/v2/guild/${guildId}`],
  });

  return guildQuery;
};

/*
  id (number) – The upgrade id.
  name (string) – The name of the upgrade.
  description (string) – The guild upgrade description.
  type (string) – The upgrade type. Some upgrade types will add additional fields to describe them further. Possible values:
      AccumulatingCurrency – Used for mine capacity upgrades.
      BankBag – Used for guild bank upgrades. Additional main fields include:
          bag_max_items (number) – The maximum item slots of the guild bank tab.
          bag_max_coins (number) – The maximum amount of coins that can be stored in the bank tab.
      Boost – Used for permanent guild buffs such as waypoint cost reduction.
      Claimable – Used for guild WvW tactics.
      Consumable – Used for banners and guild siege.
      Decoration – Used for decorations that must be crafted by a Scribe.
      GuildHall - Used for claiming a Guild Hall.
      GuildHallExpedition Used for the Expedition unlock.
      Hub – Used for the Guild Initiative office unlock.
      Queue - Used for Workshop Restoration 1.
      Unlock – Used for permanent unlocks, such as merchants and arena decorations.
  icon (string) – A URL pointing to an icon for the upgrade.
  build_time (number) – The time it takes to build the upgrade.
  required_level (number) – The prerequisite level the guild must be at to build the upgrade.
  experience (number) – The amount of guild experience that will be awarded upon building the upgrade.
  prerequisites (array) – An array of upgrade IDs that must be completed before this can be built.
  costs (array) – An array of objects describing the upgrade's cost. Each object in the array has the following properties:
      type (string) – The type of cost. One of Item, Collectible, Currency, Coins
      name (string) – The name of the cost.
      count (number) – The amount needed.
      item_id (number, optional) – The id of the item, if applicable, resolvable against v2/items.
*/
export interface ApiGuildUpgrade {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  build_time: number;
  required_level: number;
  experience: number;
  prerequisites: ApiGuildUpgrade['id'][];
  costs: ApiGuildUpgradeCosts;
}

export interface ApiGuildUpgradeCosts {
  type: string;
  name: string;
  count: number;
  item_id?: number;
}

export const useGuildUpgrade = (upgradeId: number) => {
  const lang = useLang();

  const query = useQuery<ApiGuildUpgrade>({
    ...QUERY_STATIC,
    queryKey: [`/v2/guild/upgrades/${upgradeId}?lang=${lang}`],
  });

  return query;
};

export const useGuildUpgrades = (upgradeIds: number[]) => {
  const lang = useLang();

  const queries = useQueries({
    queries: upgradeIds.map((upgradeId) => {
      const queryOptions: UseQueryOptions<ApiGuildUpgrade> = {
        ...QUERY_STATIC,
        queryKey: [`/v2/guild/upgrades/${upgradeId}?lang=${lang}`],
      };

      return queryOptions;
    }),
  });

  return queries;
};
