import { create } from 'zustand';
import { GameState, Player } from './types'; // Make sure Player type is imported
import { wordsList } from './data/word';

const INITIAL_TIME = 60; // 5 minutes in seconds

// Helper function to load high scores from localStorage
const loadHighScores = (): Player[] => {
  try {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load high scores:', error);
    return [];
  }
};

// Helper function to save high scores to localStorage
const saveHighScores = (scores: Player[]) => {
  try {
    localStorage.setItem('highScores', JSON.stringify(scores));
  } catch (error) {
    console.error('Failed to save high scores:', error);
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  currentWord: '',
  blacklistedWords: [],
  timer: INITIAL_TIME,
  score: 0,
  isPaused: false,
  isGameStarted: false,
  playerName: '',
  highScores: loadHighScores(), // Initialize with saved scores

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
  
  resetGame: () => {
    const state = get();
    let newHighScores = [...state.highScores];
    
    // Only add to high scores if score > 0 and playerName is not empty
    if (state.score > 0 && state.playerName.trim()) {
      const newPlayer: Player = {
        name: state.playerName.trim(),
        score: state.score
      };

      // Check if player already exists in high scores
      const existingPlayerIndex = newHighScores.findIndex(
        (p) => p.name === newPlayer.name
      );

      if (existingPlayerIndex >= 0) {
        // Update score if new score is higher
        if (newPlayer.score > newHighScores[existingPlayerIndex].score) {
          newHighScores[existingPlayerIndex] = newPlayer;
        }
      } else {
        // Add new player
        newHighScores.push(newPlayer);
      }
      
      // Sort in descending order and keep top 5
      newHighScores.sort((a, b) => b.score - a.score);
      newHighScores = newHighScores.slice(0, 5);
      
      // Save to localStorage
      saveHighScores(newHighScores);
    }
    
    set({
      isGameStarted: false,
      timer: INITIAL_TIME,
      score: 0,
      highScores: newHighScores
    });
  }
}));