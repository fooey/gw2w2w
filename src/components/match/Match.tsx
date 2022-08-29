import { flatten } from 'lodash';
import { WorldDictItem } from '~/queries/worlds';
import { useMatch } from '~/queries/wvw-match';
import { ApiMatch } from '~/types/api';
import { Logs } from './Logs';
import { Maps } from './Maps';
import { Scoreboard } from './Scoreboard';

interface IMatchProps {
  world?: WorldDictItem;
  matchId?: ApiMatch['id'];
}
export const Match: React.FC<IMatchProps> = ({ world, matchId }) => {
  const { isLoading, data: match } = useMatch(matchId);
  if (isLoading) return <>Loading...</>;
  if (!match) return <>err</>;

  const objectives = flatten(match.maps.map((m) => m.objectives));

  return (
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
  );
};
