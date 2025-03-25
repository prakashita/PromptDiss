export interface Player {
  name: string;
  score: number;
}

export interface GameState {
  currentWord: string;
  blacklistedWords: string[];
  timer: number;
  score: number;
  isPaused: boolean;
  isGameStarted: boolean;
  playerName: string;
  highScores: Player[];
  setPlayerName: (name: string) => void;
  startGame: () => void;
  incrementScore: () => void;
  skipWord: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetGame: () => void;
}