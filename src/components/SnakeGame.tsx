import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
        case 'Escape':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check wall collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [food, isGameOver, isPaused, generateFood]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setHighScore(prev => Math.max(prev, score));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[450px]">
      <div className="flex justify-between w-full mb-4 px-2 border-b-2 border-cyan pb-2">
        <div className="text-cyan text-sm md:text-base font-pixel">
          DATA: {score}
        </div>
        <div className="text-magenta text-sm md:text-base font-pixel">
          PEAK: {highScore}
        </div>
      </div>

      <div 
        className="relative bg-dark-surface border-4 border-magenta overflow-hidden"
        style={{ 
          width: '100%', 
          maxWidth: '400px',
          aspectRatio: '1 / 1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Render Food */}
        <div 
          className="bg-magenta crt-flicker"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '1px'
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => (
          <div 
            key={`${segment.x}-${segment.y}-${index}`}
            className={`${index === 0 ? 'bg-white' : 'bg-cyan'}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              margin: '1px'
            }}
          />
        ))}

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-dark-bg/90 flex flex-col items-center justify-center z-10 border-4 border-magenta m-2">
            <h2 className="text-2xl md:text-3xl font-pixel text-magenta mb-4 text-center">
              <span className="glitch" data-text="FATAL_ERR">FATAL_ERR</span>
            </h2>
            <p className="text-2xl text-cyan mb-8 font-terminal">SECTORS CORRUPTED: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-magenta text-dark-bg font-pixel text-xs md:text-sm hover:bg-cyan transition-colors"
            >
              REBOOT_SYS
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-dark-bg/80 flex items-center justify-center z-10">
            <h2 className="text-2xl font-pixel text-cyan glitch" data-text="SYS.HALTED">SYS.HALTED</h2>
          </div>
        )}
      </div>

      <div className="mt-6 text-magenta text-xl text-center border border-cyan p-3 w-full max-w-[400px] bg-dark-bg">
        <p>INPUT: [W,A,S,D] OR [ARROWS]</p>
        <p>INTERRUPT: [SPACE]</p>
      </div>
    </div>
  );
}
