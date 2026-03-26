import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 relative overflow-hidden crt-flicker">
      <div className="static-noise"></div>
      <div className="scanlines"></div>
      
      <header className="mb-8 text-center z-10 screen-tear">
        <h1 className="text-3xl md:text-5xl font-pixel mb-4 text-cyan">
          <span className="glitch" data-text="SYS.SNAKE_PROTOCOL">SYS.SNAKE_PROTOCOL</span>
        </h1>
        <p className="text-magenta font-terminal text-2xl tracking-widest uppercase">
          [ STATUS: ONLINE // AWAITING_INPUT ]
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        <div className="lg:col-span-4 flex justify-center lg:justify-end order-2 lg:order-1 screen-tear" style={{ animationDelay: '1s' }}>
          <MusicPlayer />
        </div>

        <div className="lg:col-span-8 flex justify-center order-1 lg:order-2 screen-tear" style={{ animationDelay: '2.5s' }}>
          <SnakeGame />
        </div>
      </main>
    </div>
  );
}
