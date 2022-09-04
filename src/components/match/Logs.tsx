import classNames from 'classnames';
import { Reorder } from 'framer-motion';
import { find, keys, map, maxBy, noop, sortBy } from 'lodash';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { MdFlag, MdHistory, MdHome, MdPlace, MdShield } from 'react-icons/md';
import { useWvwObjective, useWvwObjectives } from '~/queries';
import { ApiMatchObjective, WvwMaps, WvwObjectiveTypes } from '~/types/api';
import { useLang } from '~/utils/langs';
import {
  ObjectiveGuild,
  ObjectiveIcon,
  ObjectiveIconsMap,
  ObjectiveName,
  SVGComponent,
  TimestampRelative,
} from './Objectives';

type ObjectivesEventTypes = 'capture' | 'claim' | 'upgrade';
interface ILogsProps {
  objectives: ApiMatchObjective[];
}

const objectiveFiltersDefault: Record<WvwObjectiveTypes, boolean | null> = {
  Castle: true,
  Keep: true,
  Tower: true,
  Camp: true,
  Spawn: null,
  Mercenary: null,
  Ruins: null,
};

const mapFiltersDefault: Record<WvwMaps, boolean | null> = {
  Center: true,
  RedHome: true,
  BlueHome: true,
  GreenHome: true,
};

const eventFiltersDefault: Record<ObjectivesEventTypes, boolean | null> = {
  capture: true,
  claim: true,
  upgrade: null,
};

const EventIconsMap: Record<ObjectivesEventTypes, SVGComponent> = {
  capture: MdPlace,
  claim: MdFlag,
  upgrade: MdShield,
};

export const Logs: React.FC<ILogsProps> = ({ objectives }) => {
  const apiObjectives = useWvwObjectives();

  const [objectiveFilters, setObjectiveFilters] = useState(objectiveFiltersDefault);
  const [mapFilters, setMapFilters] = useState(mapFiltersDefault);
  const [eventFilters, setEventFilters] = useState(eventFiltersDefault);

  const lastFlipped = maxBy(objectives, 'last_flipped')?.last_flipped;
  const lastClaimed = maxBy(objectives, 'claimed_at')?.claimed_at;

  const filteredObjectives = useMemo(() => {
    const enabledTypes = keys(objectiveFilters).filter((k) => objectiveFilters[k as WvwObjectiveTypes]);
    const enabledMaps = keys(mapFilters).filter((k) => mapFilters[k as WvwMaps]);

    return objectives.filter((mapObjective) => {
      const apiObjective = find(apiObjectives.data, { id: mapObjective.id });
      return enabledTypes.includes(mapObjective.type) && apiObjective && enabledMaps.includes(apiObjective.map_type);
    });
  }, [lastFlipped, lastClaimed, objectiveFilters, apiObjectives]);

  const captures = useMemo(() => {
    if (!eventFilters.capture) return [];

    return filteredObjectives
      .filter((mapObjective) => mapObjective.last_flipped)
      .map(
        (mapObjective) => ({ type: 'capture', timestamp: mapObjective.last_flipped, mapObjective } as ObjectiveEvent)
      );
  }, [filteredObjectives, eventFilters.capture]);

  const claims = useMemo(() => {
    if (!eventFilters.claim) return [];
    return filteredObjectives
      .filter((mapObjective) => mapObjective.claimed_at)
      .map((mapObjective) => ({ type: 'claim', timestamp: mapObjective.claimed_at, mapObjective } as ObjectiveEvent));
  }, [filteredObjectives, eventFilters.claim]);

  const sorted = useMemo(() => sortBy([...captures, ...claims], 'timestamp').reverse(), [filteredObjectives]);

  return (
    <div className="w-[768px] rounded-xl bg-white shadow">
      <LogFilters
        {...{ objectiveFilters, mapFilters, eventFilters, setObjectiveFilters, setMapFilters, setEventFilters }}
      />
      <div>
        <Reorder.Group as="ol" axis="y" values={sorted} onReorder={noop} className="flex flex-col p-4">
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
    </div>
  );
};
interface ILogFiltersProps {
  objectiveFilters: Record<WvwObjectiveTypes, boolean | null>;
  mapFilters: Record<WvwMaps, boolean | null>;
  eventFilters: Record<ObjectivesEventTypes, boolean | null>;
  setObjectiveFilters: (filters: Record<WvwObjectiveTypes, boolean | null>) => void;
  setMapFilters: (filters: Record<WvwMaps, boolean | null>) => void;
  setEventFilters: (filters: Record<ObjectivesEventTypes, boolean | null>) => void;
}
const LogFilters: React.FC<ILogFiltersProps> = ({
  objectiveFilters,
  mapFilters,
  eventFilters,
  setObjectiveFilters,
  setMapFilters,
  setEventFilters,
}) => {
  const toggleObjectiveFilter = (k: WvwObjectiveTypes) => {
    setObjectiveFilters({ ...objectiveFilters, [k]: !objectiveFilters[k] });
  };

  const toggleMapFilter = (k: WvwMaps) => {
    setMapFilters({ ...mapFilters, [k]: !mapFilters[k] });
  };

  const toggleEventFilter = (k: ObjectivesEventTypes) => {
    setEventFilters({ ...eventFilters, [k]: !eventFilters[k] });
  };

  return (
    <div className="flex flex-row items-center justify-between gap-8 rounded-t-xl bg-neutral-50 px-4 py-2">
      <h1 className="flex items-center gap-2 text-2xl font-thin">
        <MdHistory className={``} />
        <div>Event Log</div>
      </h1>
      <div className="flex flex-row gap-4 bg-neutral-50 px-4 py-2">
        <ul className="flex flex-row gap-1">
          {map(objectiveFilters, (v: boolean | null, k: WvwObjectiveTypes) => {
            if (v === null) return null;
            const SvgIcon = ObjectiveIconsMap[k];
            const title = `${k}: ${v ? 'Visible' : 'Hidden'}`;

            return (
              <li key={k} onClick={() => toggleObjectiveFilter(k)} title={title}>
                <SvgIcon
                  className={classNames(`h-6 w-6 cursor-pointer`, {
                    'opacity-30': !v,
                  })}
                />
              </li>
            );
          })}
        </ul>
        <ul className="flex flex-row gap-1">
          {map(mapFilters, (v: boolean | null, k: WvwMaps) => {
            if (v === null) return null;

            return (
              <li key={k} onClick={() => toggleMapFilter(k)} title={k}>
                <HomeIcon
                  className={classNames(`h-6 w-6 cursor-pointer`, {
                    'opacity-30': !v,
                  })}
                  map={k}
                />
              </li>
            );
          })}
        </ul>
        <ul className="flex flex-row gap-1">
          {map(eventFilters, (v: boolean | null, k: ObjectivesEventTypes) => {
            if (v === null) return null;
            const SvgIcon = EventIconsMap[k];

            return (
              <li key={k} onClick={() => toggleEventFilter(k)} title={k}>
                <SvgIcon
                  className={classNames(`h-6 w-6 cursor-pointer`, {
                    'opacity-30': !v,
                  })}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const HomeIcon: React.FC<{ map?: WvwMaps; className?: string }> = ({ map, className }) => (
  <MdHome
    title={map}
    className={classNames(className, {
      'fill-black': map === 'Center',
      'fill-green-900': map === 'GreenHome',
      'fill-red-900': map === 'RedHome',
      'fill-blue-900': map === 'BlueHome',
    })}
  />
);

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
  const EventIcon = type === 'capture' ? MdPlace : MdFlag;

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
      <ObjectiveIcon mapObjective={mapObjective} />
      <ObjectiveGuild mapObjective={mapObjective} />

      <div className="flex flex-auto flex-row items-center justify-between gap-2">
        <div>
          <ObjectiveName mapObjective={mapObjective} />
        </div>
        <div className="flex flex-row gap-1 text-xs">
          <TimestampRelative timestamp={timestamp} highlightDuration={null} maxDuration={null} />
          <HomeIcon map={objectiveQuery.data?.map_type} className={`h-6 w-6`} />
          <EventIcon title={type} className={`h-6 w-6`} />
        </div>
      </div>
    </div>
  );
};

export const Timestamp: React.FC<{ timestamp: string }> = ({ timestamp }) => {
  const lang = useLang();

  return (
    <>{DateTime.fromISO(timestamp).toLocal().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS, { locale: lang })}</>
  );
};
