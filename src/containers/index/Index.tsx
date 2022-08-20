import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { Dictionary, keyBy, map, uniq } from 'lodash';
import { Duration } from 'luxon';
import React from 'react';
import { Layout } from '~/components/layout/Layout';
import { WorldIdLink } from '~/components/WorldName';
import type { ApiMatchOverview, ApiMatchScores, WvwTeams } from '~/types/api';
import { useLang } from '~/utils/langs';

const teams: WvwTeams[] = ['red', 'blue', 'green'];

export const Index = () => {
  // const matchNumbers = uniq(map(matches, 'number')).sort();

  return (
    <Layout>
      <main className="flex-auto">
        <section className="bg-neutral mx-auto flex w-fit flex-col gap-4 rounded border bg-white py-4 px-8 shadow">
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
    <table>
      <tbody>
        {matchIds.map((matchId, index) => {
          const isNewRegion = index > 0 && matchId.split('-')[0] !== matchIds[index - 1].split('-')[0];

          return (
            <React.Fragment key={matchId}>
              {isNewRegion ? (
                <tr>
                  <th colSpan={6} className="py-4">
                    <hr />
                  </th>
                </tr>
              ) : null}

              <tr key={matchId} className={`even:bg-slate-50`}>
                <MatchOverview key={matchId} matchId={matchId} overviews={overviews} scores={scores} />
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

interface IMatchOverviewProps {
  matchId: string;
  overviews: Dictionary<ApiMatchOverview>;
  scores: Dictionary<ApiMatchScores>;
}
const MatchOverview: React.FC<IMatchOverviewProps> = ({ matchId, overviews, scores }) => {
  const lang = useLang();

  const matchOverview = overviews[matchId];
  const matchScores = scores[matchId];
  const worldsByTeams = matchOverview.all_worlds;

  const orderedScores = [matchScores.scores.red, matchScores.scores.blue, matchScores.scores.green].sort().reverse();
  const uniqueScores = uniq(orderedScores);

  return (
    <>
      {teams.map((teamColor) => {
        const teamWorlds = worldsByTeams[teamColor].filter((id) => id < 10000);
        const teamScore = matchScores.scores[teamColor];
        const rank = uniqueScores.indexOf(teamScore) + 1;

        return (
          <React.Fragment key={`${matchId}:${teamColor}`}>
            <td className="align-top">
              <div
                className={classNames(`flex flex-col gap-1 py-2 px-4`, {
                  'text-green-900': teamColor === 'green',
                  'text-red-900': teamColor === 'red',
                  'text-blue-900': teamColor === 'blue',
                })}
              >
                <div
                  className={classNames(`text-xl`, {
                    'font-bold': rank === 1,
                  })}
                >
                  {teamScore.toLocaleString(lang, {})}
                </div>
                <div className="text-sm">
                  {teamWorlds.map((worldId) => (
                    <div key={worldId}>
                      <WorldIdLink worldId={worldId} />
                    </div>
                  ))}
                </div>
              </div>
            </td>
          </React.Fragment>
        );
      })}
    </>
  );
};
