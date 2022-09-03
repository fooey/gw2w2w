import classNames from 'classnames';
import { Reorder } from 'framer-motion';
import { noop, sortBy } from 'lodash';
import { DateTime } from 'luxon';
import { useWvwObjective } from '~/queries';
import { ApiMatchObjective } from '~/types/api';
import { useLang } from '~/utils/langs';
import { ObjectiveGuild, ObjectiveIcon, ObjectiveName, TimestampRelative } from './Objectives';
import { objectiveTypes } from './utils';

interface ILogsProps {
  objectives: ApiMatchObjective[];
}
export const Logs: React.FC<ILogsProps> = ({ objectives }) => {
  const filteredObjectives = objectives.filter((mapObjective) => objectiveTypes.includes(mapObjective.type));
  const captures = filteredObjectives
    .filter((mapObjective) => mapObjective.last_flipped)
    .map((mapObjective) => ({ type: 'capture', timestamp: mapObjective.last_flipped, mapObjective } as ObjectiveEvent));
  const claims = filteredObjectives
    .filter((mapObjective) => mapObjective.claimed_at)
    .map((mapObjective) => ({ type: 'claim', timestamp: mapObjective.claimed_at, mapObjective } as ObjectiveEvent));

  const events = [...captures, ...claims];
  const sorted = sortBy(events, 'timestamp').reverse();

  return (
    <div className="mx-auto rounded bg-white p-4">
      <Reorder.Group as="ol" axis="y" values={sorted} onReorder={noop} className="flex flex-col">
        {sorted.map((event) => {
          return (
            <Reorder.Item
              key={`${event.type}-${event.mapObjective.id}`}
              value={event}
              dragListener={false}
              drag={false}
              className=" px-2 odd:bg-neutral-50"
            >
              <LogItem mapObjectiveEvent={event} />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
};

type ObjectivesEventTypes = 'capture' | 'claim';

interface ObjectiveEvent {
  type: ObjectivesEventTypes;
  timestamp: string;
  mapObjective: ApiMatchObjective;
}

interface ILogItemProps {
  mapObjectiveEvent: ObjectiveEvent;
}
const LogItem: React.FC<ILogItemProps> = ({ mapObjectiveEvent }) => {
  const { mapObjective, type, timestamp } = mapObjectiveEvent;
  const objectiveQuery = useWvwObjective(mapObjective.id);

  return (
    <div
      className={classNames(`flex h-10 flex-row items-center gap-1`, {
        'text-green-900': mapObjective.owner.toLowerCase() === 'green',
        'text-red-900': mapObjective.owner.toLowerCase() === 'red',
        'text-blue-900': mapObjective.owner.toLowerCase() === 'blue',
      })}
    >
      <div className="w-32 text-xs">
        <Timestamp timestamp={timestamp} />
      </div>
      <div className="w-20 text-xs">{objectiveQuery.data?.map_type}</div>
      <div className="w-20 text-xs">{type}</div>
      <ObjectiveIcon mapObjective={mapObjective} />
      <ObjectiveGuild mapObjective={mapObjective} />

      <div className="flex flex-auto flex-row items-center justify-between gap-2">
        <ObjectiveName mapObjective={mapObjective} />
        <div className="text-xs">
          <TimestampRelative timestamp={timestamp} highlightDuration={null} maxDuration={null} />
        </div>
      </div>
    </div>
  );
};

const Timestamp: React.FC<{ timestamp: string }> = ({ timestamp }) => {
  const lang = useLang();

  return (
    <>{DateTime.fromISO(timestamp).toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS, { locale: lang })}</>
  );
};
