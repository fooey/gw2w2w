import classNames from 'classnames';
import { DateTime, Duration } from 'luxon';
import { IconType } from 'react-icons';
import { GiConvergenceTarget } from 'react-icons/gi';
import {
  RiArrowDownFill,
  RiArrowLeftDownFill,
  RiArrowLeftUpFill,
  RiArrowRightDownFill,
  RiArrowRightFill,
  RiArrowRightUpFill,
  RiArrowUpFill,
} from 'react-icons/ri';
import { useWvwObjective } from '~/queries';
import { ApiMatchObjective, WvwObjectiveTypes } from '~/types/api';
import { Direction } from './objectives-layout';

import React from 'react';
import { ReactComponent as CampSVG } from '~/icons/camp.svg';
import { ReactComponent as CastleSVG } from '~/icons/castle.svg';
import { ReactComponent as KeepSVG } from '~/icons/keep.svg';
import { ReactComponent as TowerSVG } from '~/icons/tower.svg';
import { useLang } from '~/utils/langs';
import { useNow } from './utils';

type SVGComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

const ObjectiveIconsMap: Record<WvwObjectiveTypes, SVGComponent> = {
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

export const ObjectiveGuild: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => {
  const guildUrl = `https://guilds.gw2w2w.com/short/${mapObjective.claimed_by}`;
  const emblemUrl = `${guildUrl}.svg`;

  return (
    <div className="w-6">
      {mapObjective.claimed_by ? (
        <a href={guildUrl} target="_blank">
          <img src={emblemUrl} className="h-6 w-6" />
        </a>
      ) : null}
    </div>
  );
};

export const ObjectiveName: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => {
  const objectiveQuery = useWvwObjective(mapObjective.id);
  return <div className="text-sm">{objectiveQuery.data?.name}</div>;
};

const hourDuration = Duration.fromObject({ hours: 1 });
const highlightDuration = Duration.fromObject({ seconds: 60 });

export const TimestampRelative: React.FC<{ timestamp: string }> = ({ timestamp }) => {
  const lang = useLang();
  const now = useNow();
  const dateTime = DateTime.fromISO(timestamp);
  const heldDuration = now.diff(dateTime).shiftTo('hours', 'minutes', 'seconds');

  const highlight = heldDuration < highlightDuration;

  return heldDuration < hourDuration ? (
    <div
      className={classNames('p-1 transition-all duration-1000', {
        'bg-yellow-100 font-bold': highlight,
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

const DirectionIconsMap: Record<Direction, IconType> = {
  C: GiConvergenceTarget,
  N: RiArrowUpFill,
  E: RiArrowRightFill,
  W: RiArrowRightFill,
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
