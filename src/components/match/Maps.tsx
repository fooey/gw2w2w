import classNames from 'classnames';
import { chain, map } from 'lodash';
import { DateTime, Duration } from 'luxon';
import { ApiMatchMap, ApiMatchObjective, teams } from '~/types/api';
import { useLang } from '~/utils/langs';
import { DirectionIcon, ObjectiveGuild, ObjectiveIcon, ObjectiveName } from './Objectives';
import { LayoutObjective, objectivesLayout } from './objectives-layout';
import { objectiveTypes, useNow } from './utils';

export interface IMapProps {
  maps: ApiMatchMap[];
}
export const Maps: React.FC<IMapProps> = ({ maps }) => {
  return (
    <div className={`grid grid-cols-1 gap-4  px-4 md:grid-cols-4`}>
      {['Center', 'RedHome', 'GreenHome', 'BlueHome'].map((mapType) => {
        const matchMap = maps.find((m) => m.type === mapType);
        return matchMap ? <MatchMap key={matchMap.id} matchMap={matchMap} /> : null;
      })}
    </div>
  );
};
interface IMatchMapProps {
  matchMap: ApiMatchMap;
}
const MatchMap: React.FC<IMatchMapProps> = ({ matchMap }) => {
  const filteredObjectives = chain(matchMap.objectives)
    .filter((o) => objectiveTypes.includes(o.type))
    .orderBy(['points_capture'], ['desc'])
    .value();

  const mapLayout = objectivesLayout[matchMap.type];

  return (
    <div
      className={classNames(`rounded-lg border border-y-8 bg-white shadow`, {
        'border-green-900': matchMap.type === 'GreenHome',
        'border-red-900': matchMap.type === 'RedHome',
        'border-blue-900': matchMap.type === 'BlueHome',
        'border-neutral-600': matchMap.type === 'Center',
      })}
    >
      <div className="flex flex-row items-center justify-between p-2 px-4">
        <h1 className="text-center">{matchMap.type}</h1>
        <MatchMapScores mapScores={matchMap.scores} />
      </div>
      <div className={`flex flex-col gap-4 py-4`}>
        {map(mapLayout, (sectionObjectives, sectionTitle) => {
          return (
            <section key={sectionTitle}>
              {/* <h1>{sectionTitle}</h1> */}
              <div>
                {sectionObjectives.objectives.map((layoutObjective) => {
                  const objective = filteredObjectives.find((o) => o.id.split('-')[1] === layoutObjective.id);
                  return objective ? (
                    <MapObjective key={objective.id} mapObjective={objective} layoutObjective={layoutObjective} />
                  ) : (
                    <div>{layoutObjective.id}</div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

interface IMatchMapScoresProps {
  mapScores: ApiMatchMap['scores'];
}
const MatchMapScores: React.FC<IMatchMapScoresProps> = ({ mapScores }) => {
  const lang = useLang();

  return (
    <div className="flex flex-row justify-center gap-4 font-mono">
      {teams.map((teamColor) => {
        return (
          <div
            key={teamColor}
            className={classNames(``, {
              'text-green-900': teamColor === 'green',
              'text-red-900': teamColor === 'red',
              'text-blue-900': teamColor === 'blue',
            })}
          >
            {mapScores[teamColor].toLocaleString(lang)}
          </div>
        );
      })}
    </div>
  );
};

// interface IMapObjectivesProps {
//   mapObjectives: ApiMatchObjective[];
// }
// const MapObjectives: React.FC<IMapObjectivesProps> = ({ mapObjectives }) => {
//   return (
//     <div className="flex flex-col gap-1">
//       {mapObjectives.map((mapObjective) => (
//         <MapObjective key={mapObjective.id} mapObjective={mapObjective} layoutObjective={{ id: '', direction: '' }} />
//       ))}
//     </div>
//   );
// };

interface IMapObjectiveProps {
  mapObjective: ApiMatchObjective;
  layoutObjective: LayoutObjective;
}

const MapObjective: React.FC<IMapObjectiveProps> = ({ mapObjective, layoutObjective }) => {
  return (
    <div
      key={mapObjective.id}
      className={classNames(`flex h-9 flex-row items-center gap-2 px-2 even:bg-neutral-50 hover:bg-yellow-50`, {
        'text-green-900': mapObjective.owner.toLowerCase() === 'green',
        'text-red-900': mapObjective.owner.toLowerCase() === 'red',
        'text-blue-900': mapObjective.owner.toLowerCase() === 'blue',
      })}
    >
      <div className="flex h-9 flex-row items-center gap-1">
        <DirectionIcon direction={layoutObjective.direction} />
        <ObjectiveIcon mapObjective={mapObjective} />
        <ObjectiveGuild mapObjective={mapObjective} />
      </div>

      <div className="flex flex-auto flex-row items-center justify-between gap-2">
        <ObjectiveName mapObjective={mapObjective} />
        <div className="w-9 text-xs">
          {mapObjective.last_flipped ? <ImmunityCountdown timestamp={mapObjective.last_flipped} /> : null}
        </div>
      </div>
    </div>
  );
};
interface ITimestampRelativeProps {
  timestamp: string;
}
export const ImmunityCountdown: React.FC<ITimestampRelativeProps> = ({ timestamp }) => {
  const now = useNow();

  const dateTime = DateTime.fromISO(timestamp);
  const expiration = dateTime.plus(Duration.fromObject({ minutes: 5 }));

  const remainingDuration = expiration.diff(now).shiftTo('seconds');
  const secondsRemaining = remainingDuration.seconds;
  const isVisible = secondsRemaining > -60;

  return isVisible ? (
    <div
      className={classNames('w-9 origin-right bg-yellow-100 p-1 text-right leading-none transition-all duration-1000', {
        'font-bold': secondsRemaining <= 30 || secondsRemaining > 270,
        'opacity-50': secondsRemaining < 0,
        'bg-red-100': secondsRemaining < 30 && secondsRemaining >= 0,
      })}
    >
      {remainingDuration.seconds > 60 ? remainingDuration.toFormat('m:ss') : remainingDuration.toFormat('s')}
    </div>
  ) : null;
};
