import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useGameStore } from '../store';

export const Welcome = () => {
  const [name, setName] = useState('');
  const { setPlayerName, startGame, highScores } = useGameStore();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setPlayerName(name);
      startGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          PromptDiss
        </h1>
        
        <form onSubmit={handleStart} className="mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Game
          </button>
        </form>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top 5 High Scores
          </h2>
          <div className="space-y-2">
            {highScores.map((player, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span className="font-medium">{player.name}</span>
                <span className="text-indigo-600 font-bold">{player.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};