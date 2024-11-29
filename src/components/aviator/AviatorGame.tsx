import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { Plane } from 'lucide-react';
import confetti from 'canvas-confetti';
import SpaceBackground from './SpaceBackground';
import { useSpring, animated } from 'react-spring';
import { calculateMultiplier } from '../../utils/game';

const AviatorGame: React.FC = () => {
  const [multiplier, setMultiplier] = useState(1);
  const [isFlying, setIsFlying] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [betAmount] = useState(10);
  const gameLoopRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const { game } = useGame();
  
  const primaryColor = game?.config?.primary_color || '#FFB800';

  // Plane animation
  const planeAnimation = useSpring({
    transform: isFlying 
      ? 'translate(-50%, -50%) rotate(-15deg)' 
      : hasCrashed 
        ? 'translate(-50%, -50%) rotate(45deg)'
        : 'translate(-50%, -50%) rotate(0deg)',
    config: { tension: 120, friction: 14 }
  });

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  const updateGame = () => {
    if (!isFlying) return;
    
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTimeRef.current;
    const newMultiplier = calculateMultiplier(elapsedTime);
    setMultiplier(newMultiplier);

    // Random crash chance increases with multiplier
    const crashChance = Math.pow(newMultiplier - 1, 2) * 0.01;
    if (Math.random() < crashChance) {
      crashPlane();
      return;
    }
    
    gameLoopRef.current = requestAnimationFrame(updateGame);
  };

  const startFlight = () => {
    setIsFlying(true);
    setHasCrashed(false);
    startTimeRef.current = Date.now();
    gameLoopRef.current = requestAnimationFrame(updateGame);
  };

  const crashPlane = () => {
    setIsFlying(false);
    setHasCrashed(true);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  const cashOut = () => {
    if (!isFlying || hasCrashed) return;
    
    setIsFlying(false);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    // Trigger win animation
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const getWinAmount = () => {
    return (betAmount * multiplier).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
      <SpaceBackground speed={isFlying ? 2 : 1} />

      {/* Game Area */}
      <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
        {/* Multiplier */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center">
          <div 
            className={`text-7xl font-bold mb-2 transition-all ${
              isFlying ? 'scale-110 animate-pulse' : ''
            }`}
            style={{ color: primaryColor }}
          >
            {multiplier.toFixed(2)}x
          </div>
          {!hasCrashed && (
            <div className="text-xl text-gray-400">
              Potential win: {getWinAmount()} points
            </div>
          )}
        </div>

        {/* Centered Plane */}
        <animated.div 
          style={{
            ...planeAnimation,
            position: 'absolute',
            left: '50%',
            top: '50%',
          }}
          className={`transition-all duration-300 ${
            hasCrashed ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <Plane 
            className="w-24 h-24 transition-transform"
            style={{ color: primaryColor }}
          />
        </animated.div>

        {/* Game Controls */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-xs">
          {hasCrashed ? (
            <div className="text-center mb-4">
              <div className="text-red-500 text-3xl font-bold mb-4 animate-pulse">
                CRASHED AT {multiplier.toFixed(2)}x
              </div>
              <button
                onClick={startFlight}
                className="w-full py-4 px-6 rounded-xl text-xl font-medium transition-all hover:scale-105 bg-opacity-90 hover:bg-opacity-100"
                style={{ 
                  backgroundColor: primaryColor,
                  color: 'black'
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <button
              onClick={isFlying ? cashOut : startFlight}
              disabled={hasCrashed}
              className={`w-full py-4 px-6 rounded-xl text-xl font-medium transition-all
                ${isFlying 
                  ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
                  : 'hover:scale-105 bg-opacity-90 hover:bg-opacity-100'
                }`}
              style={{ 
                backgroundColor: isFlying ? undefined : primaryColor,
                color: isFlying ? 'white' : 'black'
              }}
            >
              {isFlying ? 'CASH OUT' : 'TO THE MOON! 🚀'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AviatorGame;