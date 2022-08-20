import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { Dictionary, keyBy, map, values } from 'lodash';
import { Duration } from 'luxon';
import React from 'react';
import { Layout } from '~/components/layout/Layout';
import { WorldIdLink } from '~/components/WorldName';
import type { ApiMatchOverview, ApiMatchScores, WvwTeams } from '~/types/api';
import { useLang } from '~/utils/langs';

const teams: WvwTeams[] = ['red', 'blue', 'green'];
const regions = ['1', '2'];

export const Index = () => {
  // const matchNumbers = uniq(map(matches, 'number')).sort();

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

const MatchOverviews: React.FC = () => {
  const {
    isLoading: overviewIsLoading,
    error: overviewError,
    data: overviewData,
  } = useQuery<ApiMatchOverview[]>([`/v2/wvw/matches/overview?ids=all`], {
    cacheTime: Duration.fromObject({ minutes: 60 }).as('milliseconds'),
    staleTime: Duration.fromObject({ minutes: 10 }).as('milliseconds'),
  });
  const {
    isLoading: scoresIsLoading,
    error: scoresError,
    data: scoresData,
  } = useQuery<ApiMatchScores[]>([`/v2/wvw/matches/scores?ids=all`], {
    cacheTime: Duration.fromObject({ minutes: 60 }).as('milliseconds'),
    staleTime: Duration.fromObject({ minutes: 5 }).as('milliseconds'),
    refetchInterval: Duration.fromObject({ seconds: 10 }).as('milliseconds'),
  });

  if (overviewIsLoading || scoresIsLoading) return <h1>{'Loading...'}</h1>;
  if (overviewError || scoresError) return <h1>{`An error has occurred: ${[overviewError, scoresError]}`}</h1>;

  const matchIds = map(overviewData, 'id').sort();
  const overviews = keyBy(overviewData, 'id');
  const scores = keyBy(scoresData, 'id');

  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      {regions.map((region) => {
        return (
          <div key={region} className="flex flex-col gap-4">
            {matchIds
              .filter((matchId) => matchId.startsWith(region))
              .map((matchId, index) => {
                return (
                  <React.Fragment key={matchId}>
                    <div className={`grid grid-cols-1 gap-4 rounded-lg bg-white p-4 shadow md:grid-cols-3`}>
                      <MatchOverview key={matchId} matchId={matchId} overviews={overviews} scores={scores} />
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};

interface IMatchOverviewProps {
  matchId: string;
  overviews: Dictionary<ApiMatchOverview>;
  scores: Dictionary<ApiMatchScores>;
}
const MatchOverview: React.FC<IMatchOverviewProps> = ({ matchId, overviews, scores }) => {
  const lang = useLang();

  Object.freeze(scores);

  const matchOverview = overviews[matchId];
  const matchScores = scores[matchId];
  const worldsByTeams = matchOverview.all_worlds;

  const scoreVals = values(matchScores.scores);
  const sorted = scoreVals.sort();

  return (
    <>
      {teams.map((teamColor) => {
        const teamWorlds = worldsByTeams[teamColor].filter((id) => id < 10000);
        const teamScore = matchScores.scores[teamColor];
        const rank = sorted.indexOf(teamScore);

        return (
          <React.Fragment key={`${matchId}:${teamColor}`}>
            <div
              className={classNames(`flex flex-col gap-1 text-center text-sm`, {
                'text-green-900': teamColor === 'green',
                'text-red-900': teamColor === 'red',
                'text-blue-900': teamColor === 'blue',
              })}
            >
              <div
                className={classNames(`py-1 text-3xl font-extralight`, {
                  '': rank === 1,
                })}
              >
                {teamScore.toLocaleString(lang)}
              </div>
              <>
                {teamWorlds.map((worldId) => (
                  <div key={worldId} className="whitespace-nowrap">
                    <WorldIdLink worldId={worldId} />
                  </div>
                ))}
              </>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};
