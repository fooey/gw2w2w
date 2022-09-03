import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { WvwObjectiveTypes } from '~/types/api';

export const objectiveTypes: WvwObjectiveTypes[] = ['Castle', 'Keep', 'Camp', 'Tower'];
export const objectivePriority = objectiveTypes.reduce((acc, type, index) => {
  return { ...acc, [type]: index };
}, {});

export const getNow = () => DateTime.local();
export const useNow = () => {
  const [now, setNow] = useState<DateTime>(getNow());

  useEffect(() => {
    const interval = setInterval(() => setNow(getNow()), 100);
    return () => clearInterval(interval);
  }, []);

  return now;
};
