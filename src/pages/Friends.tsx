import React, { useState, useEffect } from 'react';
import { Users, Coins, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getContrastColor } from '../utils/color';
import { getReferrals } from '../services/api';
import { Referral } from '../types/referral';

const Friends = () => {
  const { user } = useAuth();
  const { game } = useGame();
  const [copied, setCopied] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  
  const totalCoinsEarned = 0;
  const config = game?.config;
  const primaryColor = config?.primary_color || '#FFB800';
  const textColor = getContrastColor(primaryColor);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await getReferrals();
      setInvitedFriends(response.data);
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    } finally {
      setLoading(false);
    }
  };

  const getReferralText = () => {
    if (!user?.telegram_id || !game) return '';
    const referralLink = `https://t.me/nexflowclouddemo1bot/nexflowdemo1/start?startApp=ref_${user.telegram_id}&startapp=ref_${user.telegram_id}`;
    return `Join the ${game.name} Journey! Get ${config?.referral_bonus_points} Coins as a new player and stay tuned for exciting airdrops and special rewards from Binance!\n\n${referralLink}`;
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

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="text-center p-4">
        <h1 className="text-xl font-bold text-white mb-1.5 flex items-center justify-center">
          Invite friends <span className="mx-1">👥</span> and get rewards
        </h1>
        <p className="text-gray-400 text-xs">
          Earn up to {config?.referral_bonus_points_cap.toLocaleString()} points from your friends!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-4">
        <div className="bg-gray-800/80 rounded-xl p-3">
          <p className="text-gray-400 text-xs mb-1.5">Friends invited</p>
          <div className="flex items-center">
            <Users className="w-4 h-4" style={{ color: primaryColor }} />
            <span className="text-lg font-bold text-white">
              x {invitedFriends.length}
            </span>
          </div>
        </div>
        <div className="bg-gray-800/80 rounded-xl p-3">
          <p className="text-gray-400 text-xs mb-1.5">Coins earned</p>
          <div className="flex items-center">
            <Coins className="w-4 h-4" style={{ color: primaryColor }} />
            <span className="text-lg font-bold text-white">
              x {totalCoinsEarned}
            </span>
          </div>
        </div>
      </div>

      {/* Info Points */}
      <div className="space-y-2.5 px-4 mb-4">
        {config?.referral_bonus_percentage_enabled && (
          <p className="text-gray-400 text-xs">
            You could earn <span className="text-white font-medium">{config.referral_bonus_percentage}%</span> of the points from each gameplay by players you have invited, capped at <span className="text-white font-medium">{config.referral_bonus_points_cap.toLocaleString()}</span> points.
          </p>
        )}
        <p className="text-gray-400 text-xs">
          Invited friends will receive a gift of 
          <span className="text-white font-medium ml-1">{config?.referral_bonus_points.toLocaleString()}</span> points.
        </p>
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
          Invite Friends!
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

      {/* Invited Friends List */}
      {invitedFriends.length > 0 && (
        <div className="flex-1 overflow-hidden px-4">
          <h2 className="text-sm font-semibold text-white mb-2">Invited Friends</h2>
          <div className="space-y-2 overflow-y-auto h-full pb-20">
            {invitedFriends.map((friend, index) => (
              <div 
                key={index}
                className="bg-gray-800/60 rounded-lg p-2.5 flex justify-between items-center"
              >
                <div>
                  <span className="text-white text-sm">@{friend.username}</span>
                  <p className="text-gray-400 text-xs">{friend.full_name}</p>
                </div>
                <span className="text-gray-400 text-xs">
                  {friend.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;