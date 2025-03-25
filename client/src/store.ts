import { create } from 'zustand';
import { GameState } from './types';

const INITIAL_TIME = 300; // 5 minutes in seconds

const wordsList = [
  {
    word: 'React',
    blacklisted: ['JavaScript', 'Component', 'Virtual DOM', 'Hook', 'JSX']
  },
  {
    word: 'Python',
    blacklisted: ['Snake', 'Django', 'Flask', 'Indentation', 'Interpreter']
  },
];

export const useGameStore = create<GameState>((set) => ({
  currentWord: '',
  blacklistedWords: [],
  timer: INITIAL_TIME,
  score: 0,
  isPaused: false,
  isGameStarted: false,
  playerName: '',
  highScores: [
    { name: 'Alice', score: 10 },
    { name: 'Bob', score: 8 },
    { name: 'Charlie', score: 7 },
    { name: 'David', score: 6 },
    { name: 'Eve', score: 5 }
  ],

  setPlayerName: (name) => set({ playerName: name }),
  
  startGame: () => {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    set({
      isGameStarted: true,
      currentWord: wordsList[randomIndex].word,
      blacklistedWords: wordsList[randomIndex].blacklisted,
      timer: INITIAL_TIME,
      score: 0
    });
  },

  incrementScore: () => {
    set((state) => ({ score: state.score + 1 }));
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    set({
      currentWord: wordsList[randomIndex].word,
      blacklistedWords: wordsList[randomIndex].blacklisted
    });
  },

  skipWord: () => {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    set({
      currentWord: wordsList[randomIndex].word,
      blacklistedWords: wordsList[randomIndex].blacklisted
    });
  },

  pauseTimer: () => set({ isPaused: true }),
  resumeTimer: () => set({ isPaused: false }),
  resetGame: () => set({
    isGameStarted: false,
    timer: INITIAL_TIME,
    score: 0,
    playerName: ''
  })
}));