import classNames from 'classnames';
import { Reorder } from 'framer-motion';
import { flatten, groupBy, noop, sortBy, sumBy } from 'lodash';
import { DateTime, Duration } from 'luxon';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Layout } from '~/components/layout/Layout';
import { WorldIdLink } from '~/components/WorldName';
import { useWorldByName, useWorlds, WorldDictItem } from '~/queries/worlds';
import { useWorldmatch } from '~/queries/wvw-match';
import { useWvwObjective } from '~/queries/wvw-objectives';
import { ApiLang, ApiMatch, ApiMatchMap, ApiMatchObjective, teams, WvwObjectiveTypes } from '~/types/api';
import { useLang } from '~/utils/langs';

const interestingObjectiveTypes: WvwObjectiveTypes[] = ['Keep', 'Castle', 'Camp', 'Tower'];

const getNow = () => DateTime.local();
const useNow = () => {
  const [now, setNow] = useState<DateTime>(getNow());

  useEffect(() => {
    const interval = setInterval(() => setNow(getNow()), 32);
    return () => clearInterval(interval);
  }, []);

  return now;
};

export const World = () => {
  const lang = useLang();
  const params = useParams();
  const { worldName } = params;
  const { isLoading: isLoadingWorld, data: world } = useWorldByName(worldName);
  const { isLoading: isLoadingMatch, data: match } = useWorldmatch(world?.id);

  if (isLoadingWorld || isLoadingMatch) return <Layout>loading</Layout>;
  if (!worldName) return <Navigate to="/" />;

  if (!world) return <Layout>not found</Layout>;
  if (!match) return <Layout>err</Layout>;

  const objectives = flatten(match.maps.map((m) => m.objectives));

  if (worldName !== world[lang])
    return (
      <Navigate
        to={{
          pathname: `/world/${encodeURIComponent(world[lang])}`,
          search: `?lang=${lang}`,
        }}
      />
    );

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="mx-auto">
          <Scoreboard match={match} world={world} objectives={objectives} />
        </div>
        <div className="mx-auto">
          <Maps maps={match.maps} />
        </div>
        <div className="mx-auto">
          <Logs objectives={objectives} />
        </div>
      </div>
    </Layout>
  );
};

interface IScoreboardProps {
  world: WorldDictItem;
  match: ApiMatch;
  objectives: ApiMatchObjective[];
}
const Scoreboard: React.FC<IScoreboardProps> = ({ world, match, objectives }) => {
  const lang = useLang();
  const { isLoading: isLoadingWorlds, data: worlds } = useWorlds();
  const worldsByTeams = match.all_worlds;
  const objectivesByOwner = groupBy(objectives, (o) => o.owner.toLowerCase());

  return (
    <div>
      <div className={`grid grid-cols-1 gap-8 rounded-lg bg-white px-8 py-4 shadow md:grid-cols-3`}>
        {teams.map((teamColor) => {
          const teamWorlds = worldsByTeams[teamColor].filter((id) => id < 10000);
          const kdRatio = match.kills[teamColor] / match.deaths[teamColor];
          const ownedObjectives = objectivesByOwner[teamColor];

          return (
            <div
              key={teamColor}
              className={classNames(`flex flex-col gap-2 text-center text-sm`, {
                'text-green-900': teamColor === 'green',
                'text-red-900': teamColor === 'red',
                'text-blue-900': teamColor === 'blue',
              })}
            >
              <div className={classNames(`py-2 text-6xl font-extralight`)}>
                {match.scores[teamColor].toLocaleString(lang)}
              </div>
              <div className="text-base">
                {teamWorlds.map((worldId) => (
                  <div
                    key={worldId}
                    className={classNames(`flex flex-col gap-2 text-center text-sm`, {
                      'font-bold': worldId === world.id,
                    })}
                  >
                    <WorldIdLink worldId={worldId} />
                  </div>
                ))}
              </div>
              <div className="mx-auto">
                <div
                  className={classNames(`mx-auto flex flex-row items-center justify-center gap-2 text-xs`)}
                  title="Kill / Death Ratio"
                >
                  <span>K/D</span>
                  <span title="ratio">{kdRatio.toLocaleString(lang, { maximumFractionDigits: 2 })}</span>
                  <span title="kills">{match.kills[teamColor].toLocaleString(lang)}</span>
                  <span title="deaths">{match.deaths[teamColor].toLocaleString(lang)}</span>
                </div>
                <div
                  className={classNames(`mx-auto flex flex-row items-center justify-center gap-2 text-xs`)}
                  title="Objectives"
                >
                  <span title="owned">{ownedObjectives.length.toLocaleString(lang)}</span>
                  <span title="points per tick">+{sumBy(ownedObjectives, 'points_tick').toLocaleString(lang)}</span>
                  <span title="yaks delivered">{sumBy(ownedObjectives, 'yaks_delivered').toLocaleString(lang)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface IMatchProps {
  maps: ApiMatchMap[];
}
const Maps: React.FC<IMatchProps> = ({ maps }) => {
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

const ObjectiveIcon: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => (
  <div title={mapObjective.type} className={`relative h-6 w-6`}>
    <div
      className={classNames(`absolute inset-0 rounded-full border border-black`, {
        'bg-gradient-to-br from-green-600 to-green-900': mapObjective.owner.toLowerCase() === 'green',
        'bg-gradient-to-br from-red-600 to-red-900': mapObjective.owner.toLowerCase() === 'red',
        'bg-gradient-to-br from-blue-600 to-blue-900': mapObjective.owner.toLowerCase() === 'blue',
      })}
    ></div>
    <img src={`/icons/${mapObjective.type.toLowerCase()}.svg`} className={`absolute inset-1 h-4 w-4`} />
  </div>
);

const ObjectiveGuild: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => (
  <div className="w-8">
    {mapObjective.claimed_by ? (
      <img src={`https://guilds.gw2w2w.com/short/${mapObjective.claimed_by}.svg`} width={32} height={32} />
    ) : null}
  </div>
);

const ObjectiveName: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => {
  const objectiveQuery = useWvwObjective(mapObjective.id);
  return <div className="text-sm">{objectiveQuery.data?.name}</div>;
};

const hourDuration = Duration.fromObject({ hours: 1 });
const highlightDuration = Duration.fromObject({ seconds: 60 });

const lastFlippedString = (lang: ApiLang, lastFlipped: string) => {
  const now = DateTime.utc();
  const flipDateTime = DateTime.fromISO(lastFlipped);
  const heldDuration = now.diff(flipDateTime).shiftTo('hours', 'minutes', 'seconds');

  const highlight = heldDuration < highlightDuration;

  return heldDuration < hourDuration ? (
    <div
      className={classNames('p-1 transition-all duration-1000', {
        'bg-yellow-100 font-bold': highlight,
        'bg-white': !highlight,
      })}
    >
      {flipDateTime.toRelative({
        style: 'narrow',
        locale: lang,
        round: true,
      })}
    </div>
  ) : null;
};

interface ILogsProps {
  objectives: ApiMatchObjective[];
}
const Logs: React.FC<ILogsProps> = ({ objectives }) => {
  const filteredObjectives = objectives.filter((mapObjective) => interestingObjectiveTypes.includes(mapObjective.type));
  const captures = filteredObjectives
    .filter((mapObjective) => mapObjective.last_flipped)
    .map((mapObjective) => ({ type: 'capture', timestamp: mapObjective.last_flipped, mapObjective } as ObjectiveEvent));
  const claims = filteredObjectives
    .filter((mapObjective) => mapObjective.claimed_at)
    .map((mapObjective) => ({ type: 'claim', timestamp: mapObjective.claimed_at, mapObjective } as ObjectiveEvent));

  const events = [...captures, ...claims];
  const sorted = sortBy(events, 'timestamp').reverse();

  return (
    <Reorder.Group as="ol" axis="y" values={sorted} onReorder={noop} className="flex flex-col gap-1">
      {sorted.map((event) => {
        return (
          <Reorder.Item key={`${event.type}-${event.mapObjective.id}`} value={event} dragListener={false} drag={false}>
            <LogItem mapObjectiveEvent={event} />
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
};

type ObjectivesEventTypes = 'capture' | 'claim';

interface ObjectiveEvent {
  type: ObjectivesEventTypes;
  timestamp: string;
  mapObjective: ApiMatchObjective;
}

interface ILogItemProps {
  mapObjectiveEvent: ObjectiveEvent;
}
const LogItem: React.FC<ILogItemProps> = ({ mapObjectiveEvent }) => {
  const now = useNow();
  const lang = useLang();
  const { mapObjective, type, timestamp } = mapObjectiveEvent;
  const objectiveQuery = useWvwObjective(mapObjective.id);

  return (
    <div className="flex flex-row items-center gap-1">
      <div className="w-32 text-xs">
        {DateTime.fromISO(timestamp)
          .toLocal()
          .toLocaleString(
            {
              ...DateTime.DATETIME_SHORT_WITH_SECONDS,
              year: undefined,
              month: undefined,
              weekday: 'long',
              day: undefined,
            },
            { locale: lang }
          )}
      </div>
      <div className="w-20 text-xs">{objectiveQuery.data?.map_type}</div>
      <div className="w-20 text-xs">{type}</div>
      <ObjectiveIcon mapObjective={mapObjective} />
      <ObjectiveGuild mapObjective={mapObjective} />

      <div className="flex flex-auto flex-row items-center justify-between gap-2">
        <ObjectiveName mapObjective={mapObjective} />
        <div className="text-xs">{lastFlippedString(lang, timestamp)}</div>
      </div>
    </div>
  );
};
