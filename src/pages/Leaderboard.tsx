import React, { useEffect, useState } from 'react';
import { Loader2, Trophy, Coins, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getLeaderboard } from '../services/api';
import { LeaderboardUser } from '../types/leaderboard';
import { getContrastColor } from '../utils/color';

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<{
    total: number;
    top_users: LeaderboardUser[];
  } | null>(null);
  const { user } = useAuth();
  const { game } = useGame();

  const primaryColor = game?.config?.primary_color || '#FFB800';
  const textColor = getContrastColor(primaryColor);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      setLeaderboardData(response.data);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getReferralText = () => {
    if (!user?.telegram_id || !game) return '';
    const referralLink = `https://t.me/nexflowclouddemo1bot/nexflowdemo1/start?startApp=ref_${user.telegram_id}&startapp=ref_${user.telegram_id}`;
    return `Join the ${game.name} Journey! Get ${game.config.referral_bonus_points} Coins as a new player and stay tuned for exciting airdrops and special rewards from Binance!\n\n${referralLink}`;
  };

  const handleInvite = () => {
    if (!user?.telegram_id || !game) return;
    const text = getReferralText();
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(text.split('\n\n')[1])}&text=${encodeURIComponent(text.split('\n\n')[0])}`;
    window.open(shareUrl, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getReferralText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
      </div>
    );
  }

  if (error || !leaderboardData) {
    return (
      <div className="fixed inset-0 bg-gray-900 p-6 flex flex-col items-center justify-center">
        <p className="text-red-500 text-sm">{error || 'No data available'}</p>
      </div>
    );
  }

  const isUserInTop = leaderboardData.top_users.some(u => u.username === user?.username);
  const userRank = isUserInTop ? 
    leaderboardData.top_users.findIndex(u => u.username === user?.username) + 1 :
    leaderboardData.total > 100 ? '100+' : leaderboardData.total + 1;

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="text-center p-4">
        <h1 className="text-xl font-bold text-white mb-2">
          {game?.name || 'Game'} HALL OF FAME
        </h1>
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>{leaderboardData.total.toLocaleString()} Players</span>
          <span>Total points earned</span>
        </div>

        {/* Invite Buttons */}
        <div className="grid grid-cols-6 gap-2 px-4 mb-4">
          <button
            onClick={handleInvite}
            className="col-span-5 font-medium py-2.5 px-4 rounded-xl text-sm transition-colors"
            style={{ 
              backgroundColor: primaryColor,
              color: textColor
            }}
          >
            Invite Friends for Bonus
          </button>
          <button
            onClick={handleCopy}
            className="col-span-1 bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="space-y-1">
          {leaderboardData.top_users.map((leaderboardUser, index) => {
            const rank = index + 1;
            const isCurrentUser = leaderboardUser.username === user?.username;

            return (
              <div 
                key={index}
                className={`py-3 px-4 flex items-center justify-between ${
                  isCurrentUser ? 'bg-opacity-10' : ''
                }`}
                style={{ 
                  backgroundColor: isCurrentUser ? primaryColor : undefined
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 flex items-center justify-center">
                    {rank <= 3 ? (
                      <Trophy className="w-4 h-4" style={{ 
                        color: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'
                      }} />
                    ) : (
                      <span className="text-xs text-gray-400">
                        {rank}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-white">
                    {isCurrentUser ? 'Me' : leaderboardUser.username}
                  </span>
                </div>
                <div className="flex items-center">
                  <Coins className="w-3.5 h-3.5 mr-1" style={{ color: primaryColor }} />
                  <span className="text-sm text-white">
                    {leaderboardUser.points.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;