import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { WvwObjectiveTypes } from '~/types/api';

export const interestingObjectiveTypes: WvwObjectiveTypes[] = ['Keep', 'Castle', 'Camp', 'Tower'];

export const getNow = () => DateTime.local();
export const useNow = () => {
  const [now, setNow] = useState<DateTime>(getNow());

  useEffect(() => {
    const interval = setInterval(() => setNow(getNow()), 32);
    return () => clearInterval(interval);
  }, []);

  return now;
};
