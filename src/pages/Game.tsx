import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { getContrastColor } from '../utils/color';
import { History, Loader2, TrendingUp, TrendingDown, Timer, Coins } from 'lucide-react';
import TransactionsModal from '../components/TransactionsModal';
import BackgroundEffects from '../components/BackgroundEffects';
import BackgroundPattern from '../components/BackgroundPattern';
import { useQuery } from '@tanstack/react-query';
import { getTransactions, updatePoints, getCurrentUser } from '../services/api';
import confetti from 'canvas-confetti';

const Game = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [startPrice, setStartPrice] = useState<number | null>(null);
  const [endPrice, setEndPrice] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<'moon' | 'doom' | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();
  const latestPriceRef = useRef<number | null>(null);

  const { game } = useGame();
  const { user, setUser } = useAuth();
  const primaryColor = game?.config?.primary_color || '#FFB800';
  const textColor = getContrastColor(primaryColor);

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery(
    ['transactions'],
    getTransactions,
    { enabled: showTransactions }
  );

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const connectWebSocket = () => {
    wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      setCurrentPrice(price);
      latestPriceRef.current = price;
    };

    wsRef.current.onerror = () => {
      setError('Failed to connect to price feed');
    };
  };

  const handlePrediction = (type: 'moon' | 'doom') => {
    if (isPredicting || !currentPrice) return;
    
    const initialPrice = currentPrice;
    setStartPrice(initialPrice);
    setPrediction(type);
    setIsPredicting(true);
    setShowResult(false);
    setError(null);
    setCountdown(5);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          checkResult(initialPrice, type);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerWinAnimation = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

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

  const checkResult = async (initialPrice: number, userPrediction: 'moon' | 'doom') => {
    const finalPrice = latestPriceRef.current;
    if (!finalPrice) return;

    setEndPrice(finalPrice);
    setIsPredicting(false);
    setShowResult(true);

    const won = userPrediction === 'moon' ? finalPrice > initialPrice : finalPrice < initialPrice;

    if (won) {
      triggerWinAnimation();
    }

    try {
      await updatePoints(won ? 50 : -50);
      const userResponse = await getCurrentUser();
      setUser(userResponse.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col pb-24">
      <BackgroundPattern primaryColor={primaryColor} />
      <BackgroundEffects primaryColor={primaryColor} />

      {/* Header with Records Button */}
      <div className="relative flex justify-end p-4 z-10">
        <button
          onClick={() => setShowTransactions(true)}
          className="flex items-center space-x-2 bg-gray-800/90 hover:bg-gray-700/90 text-white px-4 py-2 rounded-xl transition-all"
        >
          <History className="w-5 h-5" />
          <span className="text-sm font-medium">My Records</span>
        </button>
      </div>

      {/* User Points */}
      <div className="text-center mb-8 z-10">
        <div className="flex items-center justify-center mb-2">
          <Coins className="w-8 h-8 mr-2" style={{ color: primaryColor }} />
          <span className="text-3xl font-bold text-white">
            {user?.points?.toLocaleString() || 0}
          </span>
        </div>
      </div>

      {/* Bitcoin Price */}
      <div className="relative flex justify-between items-start px-4 z-10">
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-white mb-1">Bitcoin Price</h1>
          <p className="text-4xl font-bold" style={{ color: primaryColor }}>
            ${currentPrice?.toFixed(2) || '0.00'}
          </p>
          {startPrice && (
            <p className="text-sm text-gray-400 mt-1">
              Start: ${startPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        {isPredicting && (
          <div className="text-center mb-8">
            <Timer className="w-8 h-8 mx-auto mb-2" style={{ color: primaryColor }} />
            <p className="text-2xl font-bold text-white mb-1">{countdown}</p>
            <p className="text-gray-400">Predicting...</p>
          </div>
        )}

        {showResult && endPrice && startPrice && (
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
              {endPrice > startPrice ? 'Price Went Up! 📈' : 'Price Went Down! 📉'}
            </h2>
            <p className="text-gray-400">
              {prediction === (endPrice > startPrice ? 'moon' : 'doom') 
                ? 'You won +50 points! 🎉' 
                : 'You lost 50 points 😢'}
            </p>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          <button
            onClick={() => handlePrediction('moon')}
            disabled={isPredicting}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-500/10 border border-green-500/20 
                     hover:bg-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-8 h-8 mb-2 text-green-500" />
            <span className="text-green-500 font-medium">Up</span>
          </button>

          <button
            onClick={() => handlePrediction('doom')}
            disabled={isPredicting}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-red-500/10 border border-red-500/20 
                     hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingDown className="w-8 h-8 mb-2 text-red-500" />
            <span className="text-red-500 font-medium">Down</span>
          </button>
        </div>
      </div>

      {/* Transactions Modal */}
      {showTransactions && (
        <TransactionsModal
          transactions={transactions?.data || []}
          onClose={() => setShowTransactions(false)}
          isLoading={isLoadingTransactions}
        />
      )}
    </div>
  );
};

export default Game;