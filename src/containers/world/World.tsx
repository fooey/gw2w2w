import classNames from 'classnames';
import { flatten, groupBy, sumBy } from 'lodash';
import { DateTime } from 'luxon';
import { Navigate, useParams } from 'react-router-dom';
import { Layout } from '~/components/layout/Layout';
import { WorldIdLink } from '~/components/WorldName';
import { useWorldByName, useWorlds, WorldDictItem } from '~/queries/worlds';
import { useWorldmatch } from '~/queries/wvw-match';
import { useWvwObjective } from '~/queries/wvw-objectives';
import { ApiMatch, ApiMatchMap, ApiMatchObjective, teams } from '~/types/api';
import { useLang } from '~/utils/langs';

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
          <Scoreboard match={match} world={world} />
        </div>
        <div className="mx-auto">
          <Maps maps={match.maps} />
        </div>
      </div>
    </Layout>
  );
};

interface IScoreboardProps {
  world: WorldDictItem;
  match: ApiMatch;
}
const Scoreboard: React.FC<IScoreboardProps> = ({ world, match }) => {
  const lang = useLang();
  const { isLoading: isLoadingWorlds, data: worlds } = useWorlds();
  const worldsByTeams = match.all_worlds;
  const objectives = flatten(match.maps.map((m) => m.objectives));
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
        <MatchMap matchMap={matchMap} />
      ))}
    </div>
  );
};
interface IMatchMapProps {
  matchMap: ApiMatchMap;
}
const MatchMap: React.FC<IMatchMapProps> = ({ matchMap }) => {
  return (
    <div className={`rounded-lg bg-white shadow`}>
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
  return (
    <ul className="flex flex-col gap-1">
      {mapObjectives.map((mapObjective) => (
        <MapObjective key={mapObjective.id} mapObjective={mapObjective} />
      ))}
    </ul>
  );
};

interface IMapObjectiveProps {
  mapObjective: ApiMatchObjective;
}
const MapObjective: React.FC<IMapObjectiveProps> = ({ mapObjective }) => {
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
      <div className="w-8" title={mapObjective.type}>
        {objectiveQuery.data?.marker ? (
          <img
            src={objectiveQuery.data?.marker}
            width={32}
            height={32}
            className={classNames(``, {
              'hue-rotate-180': mapObjective.owner.toLowerCase() === 'green',
              'text-red-900': mapObjective.owner.toLowerCase() === 'red',
              'text-blue-900': mapObjective.owner.toLowerCase() === 'blue',
            })}
          />
        ) : null}
      </div>
      <div className="w-8">
        {mapObjective.claimed_by ? (
          <img src={`https://guilds.gw2w2w.com/short/${mapObjective.claimed_by}.svg`} width={32} height={32} />
        ) : null}
      </div>
      <div className="flex flex-auto flex-row items-center justify-between gap-2">
        <div className="text-sm">{objectiveQuery.data?.name}</div>
        <div className="text-xs">
          {mapObjective.last_flipped
            ? DateTime.fromISO(mapObjective.last_flipped).toRelative({ style: 'short' })
            : null}
        </div>
      </div>
    </li>
  );
};
