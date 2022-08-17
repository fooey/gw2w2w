export type WvwTeams = 'red' | 'blue' | 'green';
export type ApiLang = 'en' | 'es' | 'de' | 'fr' | 'zh';

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

export interface ApiWorld {
  id: number;
  name: string;
  population: string;
}
