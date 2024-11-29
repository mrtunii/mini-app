import React, { useEffect } from 'react';
import { Coins, Loader2, ArrowLeft } from 'lucide-react';
import { Transaction } from '../types/transaction';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { getContrastColor } from '../utils/color';

interface TransactionsModalProps {
  transactions: Transaction[];
  onClose: () => void;
  isLoading: boolean;
}

const TransactionsModal: React.FC<TransactionsModalProps> = ({ transactions, onClose, isLoading }) => {
  const { user } = useAuth();
  const { game } = useGame();
  const navigate = useNavigate();
  const primaryColor = game?.config?.primary_color || '#FFB800';
  const textColor = getContrastColor(primaryColor);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    onClose();
    navigate('/game');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'task':
        return 'Task completed';
      case 'referral_bonus':
        return 'Referral bonus';
      default:
        return 'Points earned';
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleClose}
          className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Game</span>
        </button>
        <h1 className="text-xl font-bold text-white">
          My Records
        </h1>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Total Points Card */}
      <div className="bg-gray-800/80 rounded-xl p-4 mx-4 mb-6">
        <div className="flex items-center justify-center mb-2">
          <Coins className="w-8 h-8" style={{ color: primaryColor }} />
        </div>
        <h2 className="text-center text-white text-sm mb-1">Total Points</h2>
        <p className="text-center text-2xl font-bold text-white">
          {user?.points?.toLocaleString() || 0}
        </p>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-4 pb-4">
          {transactions.map((transaction, index) => (
            <div key={index} className="border-b border-gray-800 pb-4">
              <div className="flex justify-between items-start mb-1">
                <span className="text-gray-400 text-xs">
                  {getTransactionLabel(transaction.type)}
                </span>
                <span className="text-gray-400 text-xs">
                  {formatDate(transaction.created_at)}
                </span>
              </div>
              <div className="flex items-center">
                <Coins className="w-4 h-4 mr-1" style={{ color: primaryColor }} />
                <span className="text-white">
                  x {transaction.points.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;