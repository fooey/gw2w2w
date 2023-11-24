import classNames from 'classnames';
import { DateTime, Duration } from 'luxon';
import { IconType } from 'react-icons';
import { GiConvergenceTarget } from 'react-icons/gi';
import {
  RiArrowDownFill,
  RiArrowLeftDownFill,
  RiArrowLeftFill,
  RiArrowLeftUpFill,
  RiArrowRightDownFill,
  RiArrowRightFill,
  RiArrowRightUpFill,
  RiArrowUpFill,
} from 'react-icons/ri';
import { useWvwObjective } from '~/queries';
import { ApiMatchObjective, WvwObjectiveTypes } from '~/types/api';
import { Direction } from './objectives-layout';

import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { MdShield } from 'react-icons/md';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ReactComponent as CampSVG } from '~/icons/camp.svg';
import { ReactComponent as CastleSVG } from '~/icons/castle.svg';
import { ReactComponent as KeepSVG } from '~/icons/keep.svg';
import { ReactComponent as TowerSVG } from '~/icons/tower.svg';
import { queryClient } from '~/queries/query-client';
import { useLang } from '~/utils/langs';
import { GuildDialogBody, GuildDialogTitle } from './GuildDialog';
import { useNow } from './utils';

export type SVGComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

export const ObjectiveIconsMap: Record<WvwObjectiveTypes, SVGComponent> = {
  Castle: CastleSVG,
  Keep: KeepSVG,
  Tower: TowerSVG,
  Camp: CampSVG,
  Spawn: CampSVG,
  Mercenary: CampSVG,
  Ruins: CampSVG,
};

export const ObjectiveIcon: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => {
  const SvgIcon = ObjectiveIconsMap[mapObjective.type];
  return (
    <SvgIcon
      className={classNames(`h-6 w-6 `, {
        'fill-green-900': mapObjective.owner.toLowerCase() === 'green',
        'fill-red-900': mapObjective.owner.toLowerCase() === 'red',
        'fill-blue-900': mapObjective.owner.toLowerCase() === 'blue',
      }).toString()}
    />
  );
};
// export const ObjectiveIcon: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => {
//   const SvgIcon = ObjectiveIconsMap[mapObjective.type];
//   return (
//     <div
//       title={mapObjective.type}
//       className={classNames(`relative h-6 w-6`, {
//         'fill-green-900': mapObjective.owner.toLowerCase() === 'green',
//         'fill-red-900': mapObjective.owner.toLowerCase() === 'red',
//         'fill-blue-900': mapObjective.owner.toLowerCase() === 'blue',
//       })}
//     >
//       <div
//         className={classNames(`absolute inset-0 rounded-full `, {
//           // 'bg-gradient-to-br from-green-100 to-green-200': mapObjective.owner.toLowerCase() === 'green',
//           // 'bg-gradient-to-br from-red-100 to-red-200': mapObjective.owner.toLowerCase() === 'red',
//           // 'bg-gradient-to-br from-blue-100 to-blue-200': mapObjective.owner.toLowerCase() === 'blue',
//         })}
//       ></div>
//       {/* <img src={`/icons/${mapObjective.type.toLowerCase()}.svg`} className={`absolute inset-1 h-4 w-4`} /> */}
//       {/* <CampSVG width={24} height={24} className={`absolute inset-1 h-4 w-4`} /> */}
//       <SvgIcon className={`absolute inset-0 h-6 w-6 `} />
//     </div>
//   );
// };
import { BrowserRouter } from 'react-router-dom';

export const ObjectiveGuild: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => {
  const lang = useLang();
  const guildUrl = `https://guilds.gw2w2w.com/short/${mapObjective.claimed_by}`;
  const emblemUrl = `${guildUrl}.svg`;
  const guildSWAL = withReactContent(Swal);

  const openGuildDialog = () => {
    if (mapObjective.claimed_by !== undefined && mapObjective.claimed_at !== undefined) {
      const guildObjective = {
        claimed_by: mapObjective.claimed_by,
        claimed_at: mapObjective.claimed_at,
        guild_upgrades: mapObjective.guild_upgrades ?? [],
      };

      guildSWAL.fire({
        title: (
          <QueryClientProvider client={queryClient}>
            <GuildDialogTitle mapObjective={guildObjective} lang={lang} />
          </QueryClientProvider>
        ),
        html: (
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <GuildDialogBody mapObjective={guildObjective} lang={lang} />
            </QueryClientProvider>
          </BrowserRouter>
        ),
        showCloseButton: true,
      });
    }
  };

  return (
    <div className="w-6">
      {mapObjective.claimed_by ? (
        <a onClick={openGuildDialog} className={`relative block cursor-help`}>
          <img src={emblemUrl} className="h-6 w-6" />
          {mapObjective.guild_upgrades && mapObjective.guild_upgrades.length ? (
            <>
              <span className={`absolute -right-1 -top-1 w-4 stroke-black text-base text-yellow-400`}>
                <MdShield />
              </span>
              <span className={`absolute -right-1 -top-1 w-4 stroke-black text-center text-[10px] text-black`}>
                {mapObjective.guild_upgrades.length}
              </span>
            </>
          ) : null}
        </a>
      ) : null}
    </div>
  );
};

export const ObjectiveName: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => {
  const objectiveQuery = useWvwObjective(mapObjective.id);
  return <div className="text-sm">{objectiveQuery.data?.name}</div>;
};

interface ITimestampRelativeProps {
  timestamp: string;
  maxDuration?: Duration | null;
  highlightDuration?: Duration | null;
}
export const TimestampRelative: React.FC<ITimestampRelativeProps> = ({ timestamp, maxDuration, highlightDuration }) => {
  const lang = useLang();
  const now = useNow();

  const dateTime = DateTime.fromISO(timestamp);
  const elapsedDuration = now.diff(dateTime).shiftTo('hours', 'minutes', 'seconds');
  const isHighlighted = highlightDuration && elapsedDuration < highlightDuration;
  const isVisible = !maxDuration || elapsedDuration < maxDuration;

  return isVisible ? (
    <div
      className={classNames('p-1 transition-all duration-1000', {
        'bg-yellow-100 font-bold': isHighlighted,
      })}
    >
      {dateTime.toRelative({
        style: 'narrow',
        locale: lang,
        round: true,
      })}
    </div>
  ) : null;
};

TimestampRelative.defaultProps = {
  maxDuration: Duration.fromObject({ hours: 1 }),
  highlightDuration: Duration.fromObject({ minutes: 5 }),
};

const DirectionIconsMap: Record<Direction, IconType> = {
  C: GiConvergenceTarget,
  N: RiArrowUpFill,
  E: RiArrowRightFill,
  W: RiArrowLeftFill,
  S: RiArrowDownFill,
  NW: RiArrowLeftUpFill,
  NE: RiArrowRightUpFill,
  SW: RiArrowLeftDownFill,
  SE: RiArrowRightDownFill,
};

export const DirectionIcon: React.FC<{ direction: Direction }> = ({ direction }) => {
  const Icon = DirectionIconsMap[direction] ?? DirectionIconsMap['C'];

  return <Icon className="h-5 w-5" />;
};
