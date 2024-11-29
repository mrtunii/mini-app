import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Battery, Coins } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { game } = useGame();
  const primaryColor = game?.config?.primary_color || '#FFB800';
  
  const energy = {
    current: 35,
    max: 50
  };

  const games = [
    {
      id: 'up-down',
      name: 'Up & Down',
      description: 'Predict BTC price movements',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      path: '/up-down'
    },
    {
      id: 'aviator',
      name: 'Aviator',
      description: 'Multiplayer betting game',
      image: 'https://images.unsplash.com/photo-1559066653-edfd1e4d9118?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      path: '/aviator'
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col pb-24">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-gray-800/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center space-x-4">
          {/* Points */}
          <div className="flex items-center space-x-1.5">
            <Coins className="w-4 h-4" style={{ color: primaryColor }} />
            <span className="text-sm font-medium text-white">
              {user?.points?.toLocaleString() || 0}
            </span>
          </div>
          
          {/* Energy */}
          <div className="flex items-center space-x-1.5">
            <Battery className="w-4 h-4 text-green-400" />
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-white">{energy.current}</span>
              <span className="text-xs text-gray-400">/ {energy.max}</span>
            </div>
          </div>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-white/10 overflow-hidden">
          {user?.photo_url ? (
            <img 
              src={user.photo_url} 
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-medium text-white">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      </div>

      {/* Marketing Banner */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          alt="Crypto Gaming"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-xl font-bold text-white mb-1">Welcome to Crypto Gaming</h2>
          <p className="text-sm text-gray-300">Play, earn, and compete with others!</p>
        </div>
      </div>

      {/* Games Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Featured Games</h2>
          <span className="text-xs text-gray-400">More coming soon</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => navigate(game.path)}
              className="group relative bg-gray-800/50 rounded-xl overflow-hidden border border-white/5 backdrop-blur-sm
                       hover:scale-105 transition-all duration-300"
            >
              <div className="aspect-square">
                <img 
                  src={game.image} 
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-bold text-white mb-0.5">{game.name}</h3>
                  <p className="text-xs text-gray-400">{game.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;