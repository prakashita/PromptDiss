import React, { useState, useEffect } from 'react';
import { Clock, SkipForward, Send } from 'lucide-react';
import { useGameStore } from '../store';

export const Game = () => {
  const {
    currentWord,
    blacklistedWords,
    timer,
    score,
    isPaused,
    incrementScore,
    skipWord,
    pauseTimer,
    resumeTimer,
    resetGame
  } = useGameStore();

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && timer > 0) {
        useGameStore.setState({ timer: timer - 1 });
      }
      if (timer === 0) {
        resetGame();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    pauseTimer();
    setMessages(prev => [...prev, `You: ${prompt}`]);
    
    setTimeout(() => {
      const isCorrect = Math.random() > 0.5;
      if (isCorrect) {
        setMessages(prev => [...prev, `AI: The word is "${currentWord}"!`]);
        incrementScore();
      } else {
        setMessages(prev => [...prev, `AI: That's not the word I'm thinking of...`]);
      }
      setPrompt('');
      resumeTimer();
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="h-screen flex bg-[#0a192f]">
      {/* Left Panel */}
      <div className="w-1/2 p-6 flex flex-col border-r border-[#1e2d3d]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-lg font-medium text-[#8892b0] mb-1">Current Word</h1>
            <h2 className="text-2xl font-bold text-[#64ffda]">{currentWord}</h2>
          </div>
          <div className="flex items-center gap-2 bg-[#112240] px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-[#64ffda]" />
            <span className="text-lg font-medium text-[#64ffda]">{formatTime(timer)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 bg-[#112240] px-4 py-2 rounded-lg">
          <span className="text-[#8892b0]">Score:</span>
          <span className="text-lg font-medium text-[#64ffda]">{score}</span>
        </div>

        <div className="flex-grow">
          <h3 className="text-sm font-medium text-[#8892b0] mb-3">Blacklisted Words:</h3>
          <div className="flex flex-wrap gap-2">
            {blacklistedWords.map((word, index) => (
              <div
                key={index}
                className="bg-[#112240] text-[#64ffda] px-3 py-1 rounded-lg text-sm font-medium"
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={skipWord}
          className="flex items-center justify-center gap-2 bg-[#112240] hover:bg-[#1e2d3d] px-4 py-2 rounded-lg transition-colors text-sm font-medium text-[#64ffda] w-fit ml-auto"
        >
          <SkipForward className="w-4 h-4" />
          Skip Word
        </button>
      </div>

      {/* Right Panel - Chat */}
      <div className="w-1/2 flex flex-col">
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.startsWith('You:')
                    ? 'bg-[#112240] ml-auto'
                    : 'bg-[#1e2d3d]'
                }`}
              >
                <p className="text-sm text-[#8892b0]">{message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#1e2d3d] p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Write your prompt here... (Press Enter to send)"
              className="flex-1 px-3 py-2 rounded-lg bg-[#112240] border border-[#1e2d3d] focus:outline-none focus:border-[#64ffda] resize-none h-[50px] text-sm text-[#8892b0] placeholder-[#4a5567]"
            />
            <button
              type="submit"
              className="bg-[#64ffda] text-[#0a192f] px-4 rounded-lg hover:bg-[#4cd8b9] transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};