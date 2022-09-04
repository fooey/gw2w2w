import classNames from 'classnames';
import { Dictionary, keyBy, keys } from 'lodash';
import React from 'react';
import { Layout } from '~/components/layout/Layout';
import { WorldIdLink } from '~/components/WorldName';
import { useMatchesOverview, useMatchesScores } from '~/queries';
import { ApiMatchOverview, ApiMatchScores, regions, teams, WvwTeams } from '~/types/api';
import { useLang } from '~/utils/langs';

export const MatchOverviewsContainer = () => {
  return (
    <Layout>
      <main className="flex-auto">
        <section className="bg-neutral mx-auto flex w-fit flex-col gap-2 ">
          <MatchOverviews />
        </section>
      </main>
    </Layout>
  );
};

export default MatchOverviewsContainer;

const MatchOverviews: React.FC = () => {
  const { isLoading: overviewIsLoading, error: overviewError, data: overviewData } = useMatchesOverview();
  const { isLoading: scoresIsLoading, error: scoresError, data: scoresData } = useMatchesScores();

  if (overviewIsLoading || scoresIsLoading) return <h1>{'Loading...'}</h1>;
  if (overviewError || scoresError) return <h1>{`An error has occurred: ${[overviewError, scoresError]}`}</h1>;

  const overviews = keyBy(overviewData, 'id');
  const scores = keyBy(scoresData, 'id');

  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      {regions.map((region) => (
        <RegionOverview key={region} region={region} overviews={overviews} scores={scores} />
      ))}
    </div>
  );
};

interface IRegionOverviewProps {
  region: '1' | '2';
  overviews: Dictionary<ApiMatchOverview>;
  scores: Dictionary<ApiMatchScores>;
}
const RegionOverview: React.FC<IRegionOverviewProps> = ({ region, overviews, scores }) => {
  const matchIds = keys(overviews).sort();

  return (
    <div key={region} className="flex flex-col gap-4">
      {matchIds
        .filter((matchId) => matchId.startsWith(region))
        .map((matchId) => (
          <MatchOverview key={matchId} matchId={matchId} overviews={overviews} scores={scores} />
        ))}
    </div>
  );
};

interface IMatchOverviewProps {
  matchId: string;
  overviews: Dictionary<ApiMatchOverview>;
  scores: Dictionary<ApiMatchScores>;
}
const MatchOverview: React.FC<IMatchOverviewProps> = ({ matchId, overviews, scores }) => {
  const matchScores = scores[matchId];
  const worldsByTeams = overviews[matchId].all_worlds;

  return (
    <div className={`grid grid-cols-1 gap-4 rounded-lg bg-white p-4 shadow md:grid-cols-3`}>
      {teams.map((teamColor) => (
        <MatchTeam
          key={`${matchId}-${teamColor}`}
          teamColor={teamColor}
          matchId={matchId}
          matchScores={matchScores}
          worldsByTeams={worldsByTeams}
        />
      ))}
    </div>
  );
};

interface IMatchTeamProps {
  teamColor: WvwTeams;
  matchId: string;
  matchScores: ApiMatchScores;
  worldsByTeams: Record<WvwTeams, number[]>;
}

const MatchTeam: React.FC<IMatchTeamProps> = ({ matchScores, worldsByTeams, teamColor, matchId }) => {
  const lang = useLang();
  const teamWorlds = worldsByTeams[teamColor].filter((id) => id < 10000);
  const teamScore = matchScores.scores[teamColor];

  return (
    <div
      key={`${matchId}:${teamColor}`}
      className={classNames(`flex flex-col text-center text-sm`, {
        'text-green-900': teamColor === 'green',
        'text-red-900': teamColor === 'red',
        'text-blue-900': teamColor === 'blue',
      })}
    >
      <div className={classNames(`py-2 text-3xl font-extralight`)}>{teamScore.toLocaleString(lang)}</div>
      {teamWorlds.map((worldId) => (
        <div key={worldId} className="whitespace-nowrap">
          <WorldIdLink worldId={worldId} />
        </div>
      ))}
    </div>
  );
};
