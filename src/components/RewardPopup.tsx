import React, { useEffect, useState } from 'react';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { Achievement } from '../types';

interface RewardPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const RewardPopup: React.FC<RewardPopupProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const getIcon = () => {
    switch (achievement.type) {
      case 'streak': return <Zap className="w-8 h-8 text-yellow-400" />;
      case 'milestone': return <Target className="w-8 h-8 text-blue-400" />;
      case 'xp': return <Star className="w-8 h-8 text-purple-400" />;
      case 'daily': return <Trophy className="w-8 h-8 text-green-400" />;
      default: return <Trophy className="w-8 h-8 text-gold-400" />;
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform transition-all duration-300 ${isVisible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'}`}>
        <div className="text-center">
          <div className="animate-bounce mb-4 flex justify-center">
            {getIcon()}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Achievement Unlocked!
          </h2>
          
          <h3 className="text-xl font-semibold text-blue-400 mb-2">
            {achievement.title}
          </h3>
          
          <p className="text-gray-300 mb-6">
            {achievement.description}
          </p>
          
          <div className="animate-pulse">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-300 to-orange-500 text-white px-4 py-2 rounded-full font-semibold ">
              <Trophy className="w-4 h-4" />
              New Badge Earned!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};