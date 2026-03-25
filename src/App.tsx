/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-digital selection:bg-fuchsia-500/50 flex flex-col items-center justify-center p-4 relative overflow-hidden crt-flicker">
      {/* Static Noise & Scanlines */}
      <div className="static-noise" />
      <div className="scanlines" />

      <div className="z-10 w-full max-w-5xl flex flex-col gap-8 screen-tear">
        {/* Header */}
        <header className="flex items-center justify-between border-b-4 border-cyan-400 pb-6 rgb-split-border p-4 bg-black">
          <div className="flex items-center gap-3">
            <Terminal className="text-fuchsia-500 animate-pulse" size={32} />
            <h1 className="text-5xl font-black tracking-tighter uppercase text-cyan-400 glitch-text" data-text="SYSTEM.OVERRIDE // SNAKE.EXE">
              SYSTEM.OVERRIDE // SNAKE.EXE
            </h1>
          </div>
          <div className="flex flex-col items-end bg-black px-6 py-2 border-2 border-fuchsia-500 rgb-split">
            <span className="text-sm text-fuchsia-500 uppercase tracking-widest mb-1">DATA_FRAGMENTS</span>
            <span 
              className="text-6xl text-cyan-400 glitch-text"
              data-text={score.toString().padStart(4, '0')}
            >
              {score.toString().padStart(4, '0')}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
          {/* Game Area */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <SnakeGame onScoreUpdate={setScore} />
          </div>

          {/* Music Player Area */}
          <div className="w-full lg:w-96 flex-shrink-0 flex justify-center lg:justify-start lg:pt-12">
            <MusicPlayer />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="text-center text-fuchsia-500 text-xl uppercase tracking-widest mt-8 border-t-2 border-fuchsia-500 pt-4 rgb-split">
          <p>WARNING: UNAUTHORIZED ACCESS DETECTED</p>
        </footer>
      </div>
    </div>
  );
}

