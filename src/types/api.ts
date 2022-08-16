export type WvwTeams = 'red' | 'blue' | 'green';

export interface IApiMatch {
  all_worlds: Record<WvwTeams, number[]>;
}

export interface IApiWorld {
  id: number;
  name: string;
  population: string;
}
