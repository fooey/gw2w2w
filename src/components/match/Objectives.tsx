import classNames from 'classnames';
import { DateTime, Duration } from 'luxon';
import { useWvwObjective } from '~/queries/wvw-objectives';
import { ApiLang, ApiMatchObjective } from '~/types/api';

export const ObjectiveIcon: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => (
  <div title={mapObjective.type} className={`relative h-6 w-6`}>
    <div
      className={classNames(`absolute inset-0 rounded-full border border-black`, {
        'bg-gradient-to-br from-green-600 to-green-900': mapObjective.owner.toLowerCase() === 'green',
        'bg-gradient-to-br from-red-600 to-red-900': mapObjective.owner.toLowerCase() === 'red',
        'bg-gradient-to-br from-blue-600 to-blue-900': mapObjective.owner.toLowerCase() === 'blue',
      })}
    ></div>
    <img src={`/icons/${mapObjective.type.toLowerCase()}.svg`} className={`absolute inset-1 h-4 w-4`} />
  </div>
);

export const ObjectiveGuild: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => (
  <div className="w-8">
    {mapObjective.claimed_by ? (
      <img src={`https://guilds.gw2w2w.com/short/${mapObjective.claimed_by}.svg`} width={32} height={32} />
    ) : null}
  </div>
);

export const ObjectiveName: React.FC<{ mapObjective: ApiMatchObjective }> = ({ mapObjective }) => {
  const objectiveQuery = useWvwObjective(mapObjective.id);
  return <div className="text-sm">{objectiveQuery.data?.name}</div>;
};

const hourDuration = Duration.fromObject({ hours: 1 });
const highlightDuration = Duration.fromObject({ seconds: 60 });

export const lastFlippedString = (lang: ApiLang, lastFlipped: string) => {
  const now = DateTime.utc();
  const flipDateTime = DateTime.fromISO(lastFlipped);
  const heldDuration = now.diff(flipDateTime).shiftTo('hours', 'minutes', 'seconds');

  const highlight = heldDuration < highlightDuration;

  return heldDuration < hourDuration ? (
    <div
      className={classNames('p-1 transition-all duration-1000', {
        'bg-yellow-100 font-bold': highlight,
      })}
    >
      {flipDateTime.toRelative({
        style: 'narrow',
        locale: lang,
        round: true,
      })}
    </div>
  ) : null;
};
