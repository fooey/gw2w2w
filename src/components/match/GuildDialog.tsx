import { UseQueryResult } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import React from 'react';
import { ApiGuildUpgrade, useGuild, useGuildUpgrades } from '~/queries/guild';
import { ApiLang, ApiMatchObjective } from '~/types/api';

interface IGuildDialogTitleProps {
  mapObjective: Required<Pick<ApiMatchObjective, 'claimed_by' | 'claimed_at'>>;
  lang: ApiLang;
}

export const GuildDialogTitle: React.FC<IGuildDialogTitleProps> = ({ mapObjective, lang }) => {
  const { claimed_by, claimed_at } = mapObjective;
  const { data, isLoading } = useGuild(claimed_by);

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (!data) {
    return <div>Unknown guild</div>;
  } else {
    const claimedAtDateTime = DateTime.fromISO(claimed_at).toLocal();
    const guildUrl = `https://guilds.gw2w2w.com/guilds/${data.name}`;
    const emblemUrl = `https://guilds.gw2w2w.com/short/${mapObjective.claimed_by}.svg`;

    return (
      <div className="mb-2 flex flex-col font-normal">
        <div>
          <a href={guildUrl} target="_blank">
            <img src={emblemUrl} className={`mx-auto h-64 w-64`} />
          </a>
        </div>
        <div className="mb-2 flex flex-row justify-center gap-2 text-2xl">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{data.name}</div>
          <div className="">[{data.tag}]</div>
        </div>
        <div className="text-xs">
          {`Claimed: `}
          {claimedAtDateTime.toRelative()}
          {` @ `}
          {claimedAtDateTime.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS, { locale: lang })}
        </div>
        <div className="text-xs">
          <a href={guildUrl} target="_blank">
            {guildUrl}
          </a>
        </div>
      </div>
    );
  }
};

interface IGuildDialogBodyProps {
  mapObjective: Required<Pick<ApiMatchObjective, 'claimed_by' | 'claimed_at' | 'guild_upgrades'>>;
  lang: ApiLang;
}
export const GuildDialogBody: React.FC<IGuildDialogBodyProps> = ({ mapObjective, lang }) => {
  const { guild_upgrades } = mapObjective;
  const upgradeQueries = useGuildUpgrades(guild_upgrades);

  return (
    <div>
      <GuildUpgrades upgradeQueries={upgradeQueries} />
    </div>
  );
};

interface IGuildUpgradesProps {
  upgradeQueries: UseQueryResult<ApiGuildUpgrade, unknown>[];
}
const GuildUpgrades: React.FC<IGuildUpgradesProps> = ({ upgradeQueries }) => {
  return (
    <div className="mx-auto flex flex-col">
      {upgradeQueries.map((query, index) => {
        const { data, isLoading } = query;

        if (isLoading || !data) {
          return (
            <div className=" h-16 w-16 py-2" key={index}>
              Loading...
            </div>
          );
        }

        return (
          <div key={index} className=" flex flex-row items-center gap-4 p-2 even:bg-neutral-50">
            <img src={data.icon} className="h-16 w-16 rounded" />
            <div className="text-left">
              <div className="font-semibold">{data.name}</div>
              <div className="text-xs">{data.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
