import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, CheckSquare, Users, Disc3 } from 'lucide-react';
import { useGame } from '../context/GameContext';

const navItems = [
  { id: 'home', path: '/', label: 'Home', icon: Home },
  { id: 'leaderboard', path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'tasks', path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'spin', path: '/spin', label: 'Spin', icon: Disc3 },
  { id: 'friends', path: '/friends', label: 'Friends', icon: Users },
];

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game } = useGame();
  const currentPath = location.pathname;
  const primaryColor = game?.config?.primary_color || '#FFB800';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 bg-gradient-to-t from-gray-900 to-transparent">
      <nav className="nav-blur bg-gray-900/60 p-2 rounded-2xl shadow-glow border border-white/5 backdrop-blur-xl max-w-sm mx-auto">
        <ul className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <li key={item.id} className="relative group flex-1">
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex flex-col items-center p-2 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'scale-110' 
                      : 'text-gray-400 hover:text-gray-200'
                    }`}
                  style={{ color: isActive ? primaryColor : undefined }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse-slow' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                  <span className="text-[9px] mt-0.5 font-medium opacity-80">
                    {item.label}
                  </span>
                  {isActive && (
                    <span 
                      className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;