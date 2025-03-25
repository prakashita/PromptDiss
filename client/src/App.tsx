import React from 'react';
import { Welcome } from './components/Welcome';
import { Game } from './components/Game';
import { useGameStore } from './store';

function App() {
  const { isGameStarted } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-100">
      {isGameStarted ? <Game /> : <Welcome />}
    </div>
  );
}

export default App;