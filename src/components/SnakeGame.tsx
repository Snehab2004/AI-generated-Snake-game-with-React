import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 100;

const generateFood = (snake: { x: number; y: number }[]) => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' || e.key === 'Enter') {
      if (gameOver) {
        resetGame();
      } else {
        setIsPaused(prev => !prev);
      }
      return;
    }

    if (isPaused || gameOver) return;

    const { x, y } = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [isPaused, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        setFood(generateFood(newSnake));
        // Increase speed slightly every 50 points
        if (newScore % 50 === 0) {
          setSpeed(prev => Math.max(50, prev - 10));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [isPaused, gameOver, food, score]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, gameOver, speed]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div className="relative w-full aspect-square bg-black border-4 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)] overflow-hidden rgb-split-border">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 shadow-[0_0_15px_rgba(255,0,255,1)]"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const opacity = Math.max(0.3, 1 - (index / snake.length) * 0.8);
          const glowIntensity = isHead ? 1 : Math.max(0.2, 1 - (index / snake.length));
          
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-cyan-300 z-10' : 'bg-cyan-500'}`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                transform: isHead ? 'scale(1.1)' : 'scale(0.9)',
                opacity: opacity,
                boxShadow: `0 0 ${isHead ? '15px' : '10px'} rgba(0,255,255,${glowIntensity})`,
                transition: 'all 0.05s linear'
              }}
            />
          );
        })}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 crt-flicker">
            <h2 className="text-5xl font-bold text-fuchsia-500 mb-2 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] tracking-widest uppercase glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-cyan-400 text-2xl mb-6">SYSTEM_HALTED // DATA: {score}</p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-black border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black hover:shadow-[0_0_20px_rgba(255,0,255,0.8)] transition-all uppercase tracking-wider font-bold text-xl rgb-split"
            >
              <RotateCcw size={24} />
              REBOOT_SEQUENCE
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <button
              onClick={() => setIsPaused(false)}
              className="flex items-center gap-2 px-8 py-4 bg-black border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transition-all uppercase tracking-widest font-bold text-3xl rgb-split"
            >
              <Play size={32} fill="currentColor" />
              INITIALIZE
            </button>
            <p className="text-fuchsia-500 mt-6 text-xl tracking-widest animate-pulse">AWAITING_INPUT...</p>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-3 mt-8 sm:hidden w-full max-w-[200px]">
        <div />
        <button 
          onClick={() => setDirection({x: 0, y: -1})} 
          className="p-4 bg-black border-2 border-cyan-400 active:bg-cyan-400 active:text-black text-cyan-400 flex justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transition-all rgb-split"
        >
          <ArrowUp size={28} />
        </button>
        <div />
        <button 
          onClick={() => setDirection({x: -1, y: 0})} 
          className="p-4 bg-black border-2 border-cyan-400 active:bg-cyan-400 active:text-black text-cyan-400 flex justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transition-all rgb-split"
        >
          <ArrowLeft size={28} />
        </button>
        <button 
          onClick={() => setDirection({x: 0, y: 1})} 
          className="p-4 bg-black border-2 border-cyan-400 active:bg-cyan-400 active:text-black text-cyan-400 flex justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transition-all rgb-split"
        >
          <ArrowDown size={28} />
        </button>
        <button 
          onClick={() => setDirection({x: 1, y: 0})} 
          className="p-4 bg-black border-2 border-cyan-400 active:bg-cyan-400 active:text-black text-cyan-400 flex justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transition-all rgb-split"
        >
          <ArrowRight size={28} />
        </button>
      </div>
    </div>
  );
}
