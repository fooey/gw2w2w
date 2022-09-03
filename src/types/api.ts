export type ApiLang = 'en' | 'es' | 'de' | 'fr' | 'zh';
export type ApiRegions = '1' | '2';
export type WvwTeams = 'red' | 'blue' | 'green' | 'neutral';
export type WvwMaps = 'Center' | 'RedHome' | 'BlueHome' | 'GreenHome';
export type WvwObjectiveTypes = 'Spawn' | 'Tower' | 'Camp' | 'Castle' | 'Mercenary' | 'Keep' | 'Ruins';

export const teams: WvwTeams[] = ['red', 'blue', 'green'];
export const regions: ApiRegions[] = ['1', '2'];

export interface ApiWorld {
  id: number;
  name: string;
  population: string;
}
export interface ApiMatchBase {
  id: string;
}
export interface ApiMatchOverview extends ApiMatchBase {
  id: string;
  worlds: Record<WvwTeams, number>;
  all_worlds: Record<WvwTeams, number[]>;
}
export interface ApiMatchScores extends ApiMatchBase {
  id: string;
  scores: Record<WvwTeams, number>;
  victory_points: Record<WvwTeams, number>;
}

export interface ApiMatch {
  id: string;
  start_time: string;
  end_time: string;
  scores: Record<WvwTeams, number>;
  worlds: Record<WvwTeams, number>;
  all_worlds: Record<WvwTeams, number[]>;
  deaths: Record<WvwTeams, number>;
  kills: Record<WvwTeams, number>;
  victory_points: Record<WvwTeams, number>;
  skirmishes: ApiMatchSkirmish[];
  maps: ApiMatchMap[];
}

export interface ApiMatchSkirmish {
  id: number;
  scores: Record<WvwTeams, number>;
  map_scores: [{ type: WvwMaps; scores: Record<WvwTeams, number> }];
}

export interface ApiMatchMap {
  id: number;
  type: WvwMaps;
  scores: Record<WvwTeams, number>;
  bonuses: ApiMatchMapBonus[];
  deaths: Record<WvwTeams, number>;
  kills: Record<WvwTeams, number>;
  objectives: ApiMatchObjective[];
}
export interface ApiMatchObjective {
  id: string;
  type: WvwObjectiveTypes;
  owner: WvwTeams;
  last_flipped: string;
  points_tick: number;
  points_capture: number;
  claimed_by?: string;
  claimed_at?: string;
  yaks_delivered?: number;
  guild_upgrades?: number[];
}
export interface ApiMatchMapBonus {
  type: 'Bloodlust';
  owner: WvwTeams;
}
export interface ApiWvwObjective {
  id: string;
  name: string;
  type: WvwObjectiveTypes;

  sector_id: string;
  map_id: ApiMatchMap['id'];
  map_type: WvwMaps;
  coord: [number, number, number];
  label_coord: [number, number];
  marker: string;
  chat_link: string;
  upgrade_id?: number;
}
