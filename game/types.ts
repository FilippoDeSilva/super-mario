export interface HudState {
  score: number;
  coins: number;
  lives: number;
  time: number;
  world: string;
}

export interface LevelConfig {
  map: string[];
  tileSize: number;
  playerStart: { x: number; y: number };
  flagPos: { x: number; y: number };
}
