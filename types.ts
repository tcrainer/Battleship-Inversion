
export type GameState = 'LOBBY' | 'SETUP' | 'PASS_DEVICE' | 'QUESTION' | 'ACTION' | 'RESULT' | 'GAMEOVER';

export interface Ship {
  id: string;
  name: string;
  size: number;
  placed: boolean;
  coordinates: { x: number; y: number }[];
  isVertical: boolean;
  hits: number;
}

export interface Question {
  id: string;
  german: string;
  english: string;
  category: string;
}

export interface Player {
  id: string;
  name: string;
  ships: Ship[];
  grid: (string | null)[][]; // null = empty, 'hit', 'miss'
  isEliminated: boolean;
}

export interface Cell {
  x: number;
  y: number;
}
