import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import Navigation from './components/Navigation';
import LoadingScreen from './pages/LoadingScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { verifyTelegramAuth, getGameConfig } from './services/api';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

const MainApp = () => {
  const { login, isAuthenticated } = useAuth();
  const { setGame } = useGame();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Skip verification if already authenticated
        if (isAuthenticated) {
          const gameConfig = await getGameConfig();
          setGame(gameConfig.data);
          setIsLoading(false);
          return;
        }

        const isTelegramWebApp = window.Telegram?.WebApp;
        
        if (isTelegramWebApp) {
          const { initData } = window.Telegram.WebApp;
          
          if (!initData) {
            throw new Error('No initialization data available');
          }

          const { token, user } = await verifyTelegramAuth(initData);
          login(token, user);
          
          const gameConfig = await getGameConfig();
          setGame(gameConfig.data);

          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();
        } else {
          throw new Error('Please open this app through Telegram');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [login, isAuthenticated, setGame]); // Add isAuthenticated and setGame to dependencies

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative pb-24">
      <div className="h-full w-full">
        <AppRoutes />
      </div>
      <Navigation />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;