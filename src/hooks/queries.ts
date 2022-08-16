import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { IApiWorld } from '../types/api';

const fetchWorlds = (): Promise<IApiWorld[]> =>
  axios.get(`https://api.guildwars2.com/v2/worlds?ids=all`).then((response) => response.data);

export const useWorlds = () => useQuery([`worlds`], fetchWorlds);

const fetchWorld = (worldId: number): Promise<IApiWorld> =>
  axios.get(`https://api.guildwars2.com/v2/worlds?id=${worldId}`).then((response) => response.data);

export const useWorld = (worldId: number) => useQuery([`worlds/${worldId}`], () => fetchWorld(worldId));
