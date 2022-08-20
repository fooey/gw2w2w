export type ApiLang = 'en' | 'es' | 'de' | 'fr' | 'zh';
export type WvwTeams = 'Red' | 'Blue' | 'Green' | 'Neutral';
export type WvwMaps = 'Center' | 'RedHome' | 'BlueHome' | 'GreenHome';
export type WvwObjectiveTypes = 'Spawn' | 'Tower' | 'Camp' | 'Castle' | 'Mercenary' | 'Keep' | 'Ruins';

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
  all_worlds: Record<WvwTeams, number>;
  deaths: Record<WvwTeams, number>;
  kills: Record<WvwTeams, number>;
  victory_points: Record<WvwTeams, number>;
  skirmishes: [
    {
      id: number;
      scores: Record<WvwTeams, number>;
      map_scores: [
        {
          type: WvwMaps;
          scores: Record<WvwTeams, number>;
        }
      ];
    }
  ];
  maps: [
    {
      id: number;
      type: WvwMaps;
      scores: Record<WvwTeams, number>;
      bonuses: [
        {
          type: 'Bloodlust';
          owner: WvwTeams;
        }
      ];
      deaths: Record<WvwTeams, number>;
      kills: Record<WvwTeams, number>;
      objectives: [
        {
          id: string;
          type: string;
          owner: WvwTeams;
          last_flipped: string;
          points_tick: number;
          points_capture: number;
          claimed_by?: string;
          claimed_at?: string;
          yaks_delivered?: number;
          guild_updgrades?: number[];
        }
      ];
    }
  ];
}

export interface ApiWorld {
  id: number;
  name: string;
  population: string;
}
