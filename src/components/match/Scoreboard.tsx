import classNames from 'classnames';
import { groupBy, sumBy } from 'lodash';
import { WorldIdLink } from '~/components/WorldName';
import { WorldDictItem } from '~/queries/worlds';
import { ApiMatch, ApiMatchObjective, teams } from '~/types/api';
import { useLang } from '~/utils/langs';

export interface IScoreboardProps {
  world?: WorldDictItem;
  match: ApiMatch;
  objectives: ApiMatchObjective[];
}
export const Scoreboard: React.FC<IScoreboardProps> = ({ world, match, objectives }) => {
  const lang = useLang();

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
                      'font-bold': worldId === world?.id,
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
