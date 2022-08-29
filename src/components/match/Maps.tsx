import classNames from 'classnames';
import { Reorder } from 'framer-motion';
import { flatten, noop, sortBy } from 'lodash';
import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';
import { WorldDictItem } from '~/queries/worlds';
import { useMatch } from '~/queries/wvw-match';
import { useWvwObjective } from '~/queries/wvw-objectives';
import { ApiLang, ApiMatch, ApiMatchMap, ApiMatchObjective, teams, WvwObjectiveTypes } from '~/types/api';
import { useLang } from '~/utils/langs';
import { lastFlippedString, ObjectiveGuild, ObjectiveIcon, ObjectiveName } from './Objectives';
import { Scoreboard } from './Scoreboard';
import { interestingObjectiveTypes, useNow } from './utils';

export interface IMapProps {
  maps: ApiMatchMap[];
}
export const Maps: React.FC<IMapProps> = ({ maps }) => {
  return (
    <div className={`grid grid-cols-1 gap-4  px-4 md:grid-cols-4`}>
      {maps.map((matchMap) => (
        <MatchMap key={matchMap.id} matchMap={matchMap} />
      ))}
    </div>
  );
};
interface IMatchMapProps {
  matchMap: ApiMatchMap;
}
const MatchMap: React.FC<IMatchMapProps> = ({ matchMap }) => {
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
      <MapObjectives mapObjectives={matchMap.objectives} />
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

interface IMapObjectivesProps {
  mapObjectives: ApiMatchObjective[];
}
const MapObjectives: React.FC<IMapObjectivesProps> = ({ mapObjectives }) => {
  const filteredObjectives = mapObjectives.filter((o) => interestingObjectiveTypes.includes(o.type));

  return (
    <ul className="flex flex-col gap-1">
      {filteredObjectives.map((mapObjective) => (
        <MapObjective key={mapObjective.id} mapObjective={mapObjective} />
      ))}
    </ul>
  );
};

interface IMapObjectiveProps {
  mapObjective: ApiMatchObjective;
}

const MapObjective: React.FC<IMapObjectiveProps> = ({ mapObjective }) => {
  const now = useNow();
  const lang = useLang();
  const objectiveQuery = useWvwObjective(mapObjective.id);

  return (
    <li
      key={mapObjective.id}
      className={classNames(`flex h-8 flex-row items-center gap-2 px-2`, {
        'text-green-900': mapObjective.owner.toLowerCase() === 'green',
        'text-red-900': mapObjective.owner.toLowerCase() === 'red',
        'text-blue-900': mapObjective.owner.toLowerCase() === 'blue',
      })}
    >
      <ObjectiveIcon mapObjective={mapObjective} />
      <ObjectiveGuild mapObjective={mapObjective} />

      <div className="flex flex-auto flex-row items-center justify-between gap-2">
        <ObjectiveName mapObjective={mapObjective} />
        <div className="text-xs">
          {mapObjective.last_flipped ? lastFlippedString(lang, mapObjective.last_flipped) : null}
        </div>
      </div>
    </li>
  );
};
