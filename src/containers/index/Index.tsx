import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { Dictionary, keyBy, map } from 'lodash';
import { Duration } from 'luxon';
import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { WorldName } from '../../components/WorldName';
import type { ApiMatchOverview, ApiMatchScores, WvwTeams } from '../../types/api';
import { useLang } from '../../utils/langs';

const teams: WvwTeams[] = ['red', 'blue', 'green'];

const regions = ['1', '2'];

export const Index = () => {
  const lang = useLang();

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

  const matchNumbersInit = new Set<string>();
  const matchNumbersSet = matchIds.reduce((acc, matchId) => {
    const [, number] = matchId.split('-');
    return acc.add(number);
  }, matchNumbersInit);

  const matchNumbers: string[] = Array.from(matchNumbersSet);

  // const matchNumbers = uniq(map(matches, 'number')).sort();

  return (
    <Layout>
      <main className="flex-auto">
        <section className="bg-neutral mx-auto flex w-fit flex-col gap-4 rounded border bg-white py-4 px-8 shadow">
          <table>
            <tbody>
              {matchIds.map((matchId, index) => {
                const isNewRegion = index > 0 && matchId.split('-')[0] !== matchIds[index - 1].split('-')[0];

                return (
                  <React.Fragment key={matchId}>
                    {isNewRegion ? (
                      <tr>
                        <th colSpan={3} className="py-4">
                          <hr />
                        </th>
                      </tr>
                    ) : null}

                    <tr key={matchId} className="even:bg-slate-50">
                      <OverviewMatch key={matchId} matchId={matchId} overviews={overviews} scores={scores} />
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </Layout>
  );
};;

interface IOverviewMatchProps {
  matchId: string;
  overviews: Dictionary<ApiMatchOverview>;
  scores: Dictionary<ApiMatchScores>;
}
const OverviewMatch: React.FC<IOverviewMatchProps> = ({ matchId, overviews, scores }) => {
  const lang = useLang();

  const matchOverview = overviews[matchId];
  const matchScores = scores[matchId];
  const worldsByTeams = matchOverview.all_worlds;

  return (
    <>
      {teams.map((teamColor) => {
        const teamWorlds = worldsByTeams[teamColor].filter((id) => id < 10000);
        const teamScore = matchScores.scores[teamColor];

        return (
          <td key={`${matchId}:${teamColor}`} className="align-top">
            <div
              className={classNames(`flex flex-col gap-1 py-2 px-4`, {
                'text-green-900': teamColor === 'green',
                'text-red-900': teamColor === 'red',
                'text-blue-900': teamColor === 'blue',
              })}
            >
              <div>{teamScore.toLocaleString(lang, {})}</div>
              <div className="text-sm">
                {teamWorlds.map((worldId) => (
                  <WorldName key={worldId} worldId={worldId} />
                ))}
              </div>
            </div>
          </td>
        );
      })}
    </>
  );
};
