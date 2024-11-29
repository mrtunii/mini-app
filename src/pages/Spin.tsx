import React, { useState, useEffect, useRef } from 'react';
import { Coins, Loader2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getContrastColor } from '../utils/color';

const STORAGE_KEY = 'lastSpinTime';
const POINTS = [20, 50, 100, 150, 200, 250];
const ITEM_HEIGHT = 60; // Reduced height

const Spin = () => {
  const { game } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPoints, setWonPoints] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [reelPosition, setReelPosition] = useState(0);
  const spinTimeout = useRef<NodeJS.Timeout>();
  const spinInterval = useRef<NodeJS.Timer>();

  const primaryColor = game?.config?.primary_color || '#FFB800';
  const textColor = getContrastColor(primaryColor);

  useEffect(() => {
    checkSpinAvailability();
    const interval = setInterval(checkSpinAvailability, 1000);
    return () => {
      clearInterval(interval);
      if (spinTimeout.current) clearTimeout(spinTimeout.current);
      if (spinInterval.current) clearInterval(spinInterval.current);
    };
  }, []);

  const checkSpinAvailability = () => {
    const lastSpinTime = localStorage.getItem(STORAGE_KEY);
    if (!lastSpinTime) {
      setCanSpin(true);
      setTimeLeft(null);
      return;
    }

    const lastSpin = new Date(lastSpinTime).getTime();
    const now = new Date().getTime();
    const timeElapsed = now - lastSpin;
    const cooldown = 24 * 60 * 60 * 1000;

    if (timeElapsed < cooldown) {
      setCanSpin(false);
      const remaining = cooldown - timeElapsed;
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    } else {
      setCanSpin(true);
      setTimeLeft(null);
    }
  };

  const spin = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setWonPoints(null);

    if (spinTimeout.current) clearTimeout(spinTimeout.current);
    if (spinInterval.current) clearInterval(spinInterval.current);

    const winningIndex = Math.floor(Math.random() * POINTS.length);
    const winning = POINTS[winningIndex];

    // Initial fast spins
    let spins = 0;
    const maxSpins = 30; // Total number of fast spins
    const initialInterval = 50; // Initial speed (ms)
    const finalInterval = 200; // Final speed (ms)

    const spinWithEasing = () => {
      spins++;
      
      // Calculate current interval using easing
      const progress = spins / maxSpins;
      const currentInterval = initialInterval + (finalInterval - initialInterval) * Math.pow(progress, 2);

      setReelPosition(prev => (prev + 1) % POINTS.length);

      if (spins < maxSpins) {
        spinTimeout.current = setTimeout(spinWithEasing, currentInterval);
      } else {
        // Final positioning to winning number
        const finalSpins = (POINTS.length - (reelPosition % POINTS.length) + winningIndex) % POINTS.length;
        let currentFinalSpin = 0;

        const finalSpinInterval = setInterval(() => {
          setReelPosition(prev => (prev + 1) % POINTS.length);
          currentFinalSpin++;

          if (currentFinalSpin >= finalSpins) {
            clearInterval(finalSpinInterval);
            setIsSpinning(false);
            setWonPoints(winning);
            localStorage.setItem(STORAGE_KEY, new Date().toISOString());
            checkSpinAvailability();
          }
        }, 200);
      }
    };

    spinWithEasing();
  };

  const renderReel = () => {
    return (
      <div className="relative w-48 h-[180px] bg-gray-800/90 rounded-xl overflow-hidden shadow-2xl">
        <div 
          className="absolute inset-0 flex flex-col transition-all duration-200 ease-out"
          style={{ transform: `translateY(-${reelPosition * ITEM_HEIGHT}px)` }}
        >
          {[...POINTS, ...POINTS].map((points, i) => (
            <div
              key={i}
              className="flex items-center justify-center h-[60px] text-3xl font-bold"
              style={{ color: primaryColor }}
            >
              {points}
            </div>
          ))}
        </div>
        {/* Center highlight strip */}
        <div 
          className="absolute left-0 right-0 h-[60px] top-1/2 -translate-y-1/2 bg-gray-700/30 border-y-2 pointer-events-none"
          style={{ borderColor: primaryColor }}
        />
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-4">
      {timeLeft && (
        <div className="mb-6 text-center">
          <p className="text-gray-400 text-sm mb-1">Next spin available in</p>
          <p className="text-2xl font-bold text-white">{timeLeft}</p>
        </div>
      )}

      {/* Slot Machine */}
      <div className="relative mb-10">
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700/50">
          {renderReel()}
        </div>

        {/* Win Display */}
        {wonPoints !== null && (
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full text-center">
            <p className="text-gray-400 text-sm mb-1">Congratulations! You won</p>
            <div className="inline-flex items-center justify-center bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl animate-bounce">
              <Coins className="w-5 h-5 mr-1.5" style={{ color: primaryColor }} />
              <span className="text-2xl font-bold text-white">{wonPoints}</span>
            </div>
          </div>
        )}
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={!canSpin || isSpinning}
        className={`w-full max-w-xs py-3 rounded-xl font-medium transition-all ${
          !canSpin || isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
        style={{ 
          backgroundColor: primaryColor,
          color: textColor
        }}
      >
        {isSpinning ? (
          <Loader2 className="w-5 h-5 mx-auto animate-spin" />
        ) : (
          'Pull the Lever!'
        )}
      </button>
    </div>
  );
};

export default Spin;