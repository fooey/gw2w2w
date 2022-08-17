import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { keyBy, map } from 'lodash';
import { Duration } from 'luxon';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Footer } from '../../components/layout/Footer';
import { useWorlds } from '../../hooks/queries';
import type { ApiLang, ApiMatchOverview, ApiMatchScores, WvwTeams } from '../../types/api';

const teams: WvwTeams[] = ['red', 'blue', 'green'];

const useLang = (): ApiLang => {
  const [searchParams] = useSearchParams();
  return (searchParams.get('lang') ?? 'en') as ApiLang;
};

const langs: ApiLang[] = ['en', 'es', 'de', 'fr', 'zh'];
const flags = ['🇺🇸', '🇪🇸', '🇩🇪', '🇫🇷', '🇨🇳'];

export const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userLanguage = (searchParams.get('lang') ?? 'en') as ApiLang;

  if (!langs.includes(userLanguage)) {
    return <Navigate to={`?lang=${langs[0]}`} />;
  }

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
  const overview = keyBy(overviewData, 'id');
  const scores = keyBy(scoresData, 'id');

  return (
    <div className="flex h-full flex-col gap-8 bg-slate-100">
      <header className="flex flex-none items-center justify-between border-b bg-white p-4 ">
        <h1 className="font-extralight">gw2w2w</h1>
        <aside className="flex h-8 select-none items-center justify-between gap-2 px-4 text-2xl">
          {langs.map((lang) => (
            <a
              className={classNames('block flex-none cursor-pointer text-2xl leading-none hover:drop-shadow-lg', {
                // 'font-bold': lang === userLanguage,
                'drop-shadow-md': lang === userLanguage,
                'text-3xl': lang === userLanguage,
              })}
              onClick={() => setSearchParams({ lang })}
              title={lang}
            >
              {flags[langs.indexOf(lang)]}
            </a>
          ))}
        </aside>
      </header>
      <Matches matchIds={matchIds} overview={overview} scores={scores} />
      <Footer />
    </div>
  );
};

interface MatchesProps {
  matchIds: string[];
  overview: Record<string, ApiMatchOverview>;
  scores: Record<string, ApiMatchScores>;
}

const Matches: React.FC<MatchesProps> = ({ matchIds, overview, scores }) => {
  const lang = useLang();

  return (
    <main className="flex-auto">
      <section className="mx-auto flex w-fit flex-col gap-4 rounded border bg-white py-4 px-8 shadow">
        <table>
          <tbody>
            {matchIds.map((matchId) => {
              const matchOverview = overview[matchId];
              const matchScores = scores[matchId];

              const worldsByTeams = matchOverview.all_worlds;

              return (
                <tr key={matchId} className="even:bg-slate-50">
                  {/* <h1 className="w-20">{matchId}</h1> */}

                  {teams.map((teamColor) => {
                    const teamWorlds = worldsByTeams[teamColor].filter((id) => id < 10000);
                    const teamScore = matchScores.scores[teamColor];

                    return (
                      <td className="align-top">
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
                              <WorldName worldId={worldId} />
                            ))}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
};

const WorldName = ({ worldId }: { worldId: number }) => {
  const lang = useLang();
  const { isLoading: isLoadingWorlds, error: worldsError, data: worldsData } = useWorlds(lang);
  if (isLoadingWorlds || !worldsData) return <h2>{'Loading...'}</h2>;
  if (worldsError) return <h2>{`An error has occurred: ${worldsError}`}</h2>;

  const world = worldsData.find((world) => world.id === worldId);
  if (!world) return <h2>{`World not found: ${worldId}`}</h2>;

  return (
    <h2 className="whitespace-nowrap">
      <Link
        to={{
          pathname: `/${world.name}`,
          search: `?lang=${lang}`,
        }}
      >
        <a className="hover:underline">{world.name}</a>
      </Link>
    </h2>
  );
};

// // const fetchMatchScores = (matchId: string): Promise<IApiMatch> =>
// //   axios.get(`/v2/wvw/matches/${matchId}`).then((response) => response.data);

// const Match: React.FC<{ matchId: string }> = ({ matchId }) => {
//   const {
//     isLoading: isLoadingMatch,
//     error: matchError,
//     data: matchData,
//   } = useQuery<IApiMatch>([`/v2/wvw/matches/${matchId}`], {
//     cacheTime: Duration.fromObject({ minutes: 5 }).as('milliseconds'),
//     staleTime: Duration.fromObject({ seconds: 60 }).as('milliseconds'),
//     refetchInterval: Duration.fromObject({ seconds: 10 }).as('milliseconds'),
//   });

//   const { isLoading: isLoadingWorlds, error: worldsError, data: worldsData } = useWorlds();

//   if (isLoadingMatch || isLoadingWorlds) return <h1>{'Loading...'}</h1>;
//   if (matchError) return <h1>{`An error has occurred: ${matchError}`}</h1>;
//   if (!matchData) return <h1>{'no matchData'}</h1>;
//   if (!worldsData) return <h1>{'no worldsData'}</h1>;

//   return (
//     <div className="flex">
//       <div className="w-20">{matchId}</div>
//       <ul>
//         {map(matchData.all_worlds, (team, teamName) => (
//           <li key={teamName} className="flex">
//             <h1 className="w-20">{teamName}</h1>
//             <ul>
//               {team.map((worldId) => {
//                 const world = find(worldsData, { id: worldId });
//                 return <li key={worldId}>{world?.name ?? 'unknown world'}</li>;
//               })}
//             </ul>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
