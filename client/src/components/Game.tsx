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
  const [isLoading, setIsLoading] = useState(false);

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

  const validatePrompt = (prompt: string) => {
    const promptLower = prompt.toLowerCase();
    const wordsInPrompt = promptLower.split(/\s+/); // Split into words
    
    // Check if prompt contains current word as a separate word
    const currentWordLower = currentWord.toLowerCase();
    if (wordsInPrompt.includes(currentWordLower)) {
      return { valid: false, message: "Your prompt contains the current word!" };
    }
    
    // Check if prompt contains any blacklisted words as separate words
    for (const word of blacklistedWords) {
      const wordLower = word.toLowerCase();
      if (wordsInPrompt.includes(wordLower)) {
        return { valid: false, message: `Your prompt contains a blacklisted word: ${word}` };
      }
    }
    
    return { valid: true };
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Validate prompt first
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      setMessages(prev => [...prev, `System: ${validation.message}`]);
      return;
    }

    pauseTimer();
    setIsLoading(true);
    setMessages(prev => [...prev, `You: ${prompt}`]);

    try {
      // Send prompt to backend
      const response = await fetch('http://localhost:3000/api/generate-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      const aiWord = data.word;

      // Check if AI word matches current word
      const isCorrect = aiWord === currentWord.toLowerCase();

      if (isCorrect) {
        setMessages(prev => [...prev, `AI: The word is "${currentWord}"!`]);
        incrementScore();
      } else {
        setMessages(prev => [...prev, `AI: That's not the word I'm thinking of..."${aiWord}"!`]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, `System: Error processing your prompt`]);
    } finally {
      setPrompt('');
      setIsLoading(false);
      resumeTimer();
    }
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
      <div className="w-1/3 p-6 flex flex-col border-r border-[#1e2d3d]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-lg font-medium text-[#8892b0] mb-1">Current Word</h1>
            <h2 className="text-4xl font-bold text-[#64ffda]">{currentWord}</h2>
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
          <div className="flex flex-col gap-2">
            {blacklistedWords.map((word, index) => (
              <div
                key={index}
                className="bg-[#112240] text-[#64ffda] px-3 py-1 rounded-lg text-xl font-medium"
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
      <div className="w-2/3 flex flex-col">
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.startsWith('You:')
                    ? 'bg-[#112240] ml-auto'
                    : message.startsWith('AI:')
                    ? 'bg-[#1e2d3d]'
                    : 'bg-[#ff5555]'
                }`}
              >
                <p className="text-sm text-[#8892b0]">{message}</p>
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-lg max-w-[80%] bg-[#1e2d3d]">
                <p className="text-sm text-[#8892b0]">AI is thinking...</p>
              </div>
            )}
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
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-[#64ffda] text-[#0a192f] px-4 rounded-lg hover:bg-[#4cd8b9] transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};