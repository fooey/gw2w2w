import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { find, map } from 'lodash';
import { Duration } from 'luxon';
import { useWorlds } from '../../hooks/queries';
import type { IApiMatch } from '../../types/api';

type MatchIndex = string[];

const fetchIndex = (): Promise<MatchIndex> =>
  axios.get(`https://api.guildwars2.com/v2/wvw/matches`).then((response) => response.data);

export const Index = () => {
  const { isLoading, error, data } = useQuery([`match-index`], fetchIndex, {
    cacheTime: Duration.fromObject({ minutes: 60 }).as('milliseconds'),
    staleTime: Duration.fromObject({ minutes: 1 }).as('milliseconds'),
  });

  if (isLoading) return <h1>{'Loading...'}</h1>;
  if (error) return <h1>{`An error has occurred: ${error}`}</h1>;

  return <div className="mx-auto flex flex-col">{data ? <Matches matchIds={data.sort()} /> : <h1>no data</h1>}</div>;
};

const Matches: React.FC<{ matchIds: MatchIndex }> = ({ matchIds }) => (
  <ul>
    {matchIds.slice(0, 1).map((matchId) => (
      <li key={matchId}>
        <Match matchId={matchId} />
      </li>
    ))}
  </ul>
);

const fetchMatchScores = (matchId: string): Promise<IApiMatch> =>
  axios.get(`https://api.guildwars2.com/v2/wvw/matches/${matchId}`).then((response) => response.data);

const Match: React.FC<{ matchId: string }> = ({ matchId }) => {
  const {
    isLoading: isLoadingMatch,
    error: matchError,
    data: matchData,
  } = useQuery([`match/scores/${matchId}`], () => fetchMatchScores(matchId), {
    cacheTime: Duration.fromObject({ minutes: 5 }).as('milliseconds'),
    staleTime: Duration.fromObject({ seconds: 60 }).as('milliseconds'),
    refetchInterval: Duration.fromObject({ seconds: 10 }).as('milliseconds'),
  });

  const { isLoading: isLoadingWorlds, error: worldsError, data: worldsData } = useWorlds();

  if (isLoadingMatch || isLoadingWorlds) return <h1>{'Loading...'}</h1>;
  if (matchError) return <h1>{`An error has occurred: ${matchError}`}</h1>;
  if (!matchData) return <h1>{'no matchData'}</h1>;
  if (!worldsData) return <h1>{'no worldsData'}</h1>;

  return (
    <div className="flex">
      <div className="w-20">{matchId}</div>
      <ul>
        {map(matchData.all_worlds, (team, teamName) => (
          <li key={teamName} className="flex">
            <h1 className="w-20">{teamName}</h1>
            <ul>
              {team.map((worldId) => {
                const world = find(worldsData, { id: worldId });
                return <li key={worldId}>{world?.name ?? 'unknown world'}</li>;
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
