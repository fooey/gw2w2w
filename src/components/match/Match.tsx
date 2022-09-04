import { flatten } from 'lodash';
import React from 'react';
import { useMatch } from '~/queries';
import type { WorldDictItem } from '~/queries/worlds';
import { ApiMatch } from '~/types/api';
import { Logs } from './Logs';
import { Maps } from './Maps';
import { Scoreboard } from './Scoreboard';

interface IMatchProps {
  world?: WorldDictItem;
  matchId?: ApiMatch['id'];
}
export const Match: React.FC<IMatchProps> = ({ world, matchId }) => {
  const { isFetched, data: match } = useMatch(matchId);

  if (isFetched && !match) return <>err</>;
  if (!match) return null;

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
