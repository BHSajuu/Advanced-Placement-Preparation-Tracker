import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Target, Flame, Trophy, RefreshCw, Hash, Settings } from 'lucide-react';
import { UserProgress, UserGoals } from '../types';
import { getRandomQuote } from '../utils/motivationalQuotes';
import { GoalSetupDialog } from './GoalSetupDialog';

interface DashboardProps {
  userProgress: UserProgress;
  startDate: Date;
  userGoals?: UserGoals;
  onResetJourney: () => void;
  onUpdateGoals: (goals: UserGoals) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProgress,
  startDate,
  userGoals,
  onResetJourney,
  onUpdateGoals
}) => {
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const today = new Date();

  // Normalize dates to local midnight to count calendar days
  const toLocalMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const startMidnight = toLocalMidnight(startDate);
  const todayMidnight = toLocalMidnight(today);

  const daysPassed = Math.floor(
    (todayMidnight.getTime() - startMidnight.getTime())
    / (1000 * 60 * 60 * 24)
  ) + 1;
  const daysRemaining = Math.max(60 - daysPassed, 0);

  const todayStr = today.toISOString().split('T')[0];
  const todayTasks = userProgress.dailyHistory[todayStr] || 0;
  const todayDSAQuestions = userProgress.dsaQuestionsHistory[todayStr] || 0;

  const handleResetJourney = () => {
    if (window.confirm('Are you sure you want to start a new journey? This will clear all your progress and cannot be undone.')) {
      onResetJourney();
    }
  };

  const handleGoalSetup = () => {
    setShowGoalDialog(true);
  };

  const stats = [
    {
      title: 'Current Streak',
      value: userProgress.currentStreak,
      icon: <Flame className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      suffix: 'days'
    },
    {
      title: 'Total XP',
      value: userProgress.totalXP.toLocaleString(),
      icon: <Trophy className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      suffix: 'XP'
    },
    {
      title: 'Tasks Today',
      value: todayTasks,
      icon: <Target className="w-5 h-5" />,
      color: 'from-green-500 to-teal-500',
      suffix: 'completed'
    },
    {
      title: 'DSA Questions Today',
      value: todayDSAQuestions,
      icon: <Hash className="w-5 h-5" />,
      color: 'from-blue-500 to-purple-500',
      suffix: 'solved'
    }
  ];


  // Define color palettes for achievements
  const achievementPalettes = [
    { bg: 'from-green-500 to-teal-500', text: 'text-white' },
    { bg: 'from-blue-500 to-purple-500', text: 'text-white' },
    { bg: 'from-yellow-500 to-orange-700', text: 'text-gray-900' },
    { bg: 'from-pink-500 to-red-500', text: 'text-white' },
    { bg: 'from-indigo-500 to-blue-500', text: 'text-white' },
    { bg: 'from-gray-500 to-gray-700', text: 'text-white' }
  ];

  const getAchievementStyle = (title: string) => {
    // Simple hash based on title to pick a palette
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % achievementPalettes.length;
    return achievementPalettes[idx];
  };

  // Inject CSS for marquee scroll
  useEffect(() => {
    if (userProgress.achievements.length > 0) {
      const style = document.createElement('style');
      const duration = userProgress.achievements.length * 5; // 5s per item
      style.innerHTML = `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .achievement-marquee {
          animation: marquee ${duration}s linear infinite;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [userProgress.achievements.length]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            MAANG Placement Prep
          </h1>
          <p className="text-gray-400 mt-1">
            {today.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGoalSetup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {userGoals ? 'Update Goals' : 'Set Goals'}
          </button>
          <button
            onClick={handleResetJourney}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            New Journey
          </button>
        </div>
      </div>

      {/* Goal Setup Prompt */}
      {!userGoals && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg border-2 border-blue-400">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Welcome to Your MAANG Prep Journey!</h2>
              <p className="text-blue-100">
                Set your personalized 60-day goals to get started with smart progress tracking.
              </p>
            </div>
            <button
              onClick={handleGoalSetup}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Countdown Timer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Day {daysPassed} of 60</h2>
            <p className="text-blue-100 text-lg">
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Preparation Complete!'}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg p-3">
              <Calendar className="w-8 h-8 mb-2" />
              <div className="text-sm font-medium">
                {Math.round((daysPassed / 60) * 100)}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-full transition-all duration-500"
            style={{ width: `${Math.min((daysPassed / 60) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold text-white mb-2">Daily Motivation</h3>
        <p className="text-gray-400 italic text-lg leading-relaxed">
          "{getRandomQuote()}"
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-r ${stat.color} p-2 rounded-lg text-white`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                {stat.suffix && (
                  <div className="text-xs text-gray-400">
                    {stat.suffix}
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400">
              {stat.title}
            </h3>
          </div>
        ))}
      </div>

   {/* Achievement Showcase */}
      {userProgress.achievements.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </h3>
          <div className="overflow-hidden">
            <div className="flex space-x-4 achievement-marquee">
              {userProgress.achievements.map((achievement) => {
                const style = getAchievementStyle(achievement.title);
                return (
                  <div
                    key={achievement.id}
                    className={`m-5 hover:cursor-no-drop hover:scale-105 transition-transform ease-linear flex-shrink-0 bg-gradient-to-r ${style.bg} ${style.text} p-3 rounded-lg min-w-[120px]`}
                  >
                    <div className="font-semibold text-sm text-center">{achievement.title}</div>
                    <div className="text-xs mt-1 text-center">{achievement.description}</div>
                  </div>
                );
              })}
              {/* duplicate for seamless loop */}
              {userProgress.achievements.map((achievement) => {
                const style = getAchievementStyle(achievement.title);
                return (
                  <div
                    key={`${achievement.id}-dup`}
                    className={`flex-shrink-0 bg-gradient-to-r ${style.bg} ${style.text} p-3 rounded-lg min-w-[120px]`}
                  >
                    <div className="font-semibold text-sm text-center">{achievement.title}</div>
                    <div className="text-xs mt-1 text-center">{achievement.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Goal Setup Dialog */}
      <GoalSetupDialog
        isOpen={showGoalDialog}
        onClose={() => setShowGoalDialog(false)}
        onSave={onUpdateGoals}
        existingGoals={userGoals}
      />
    </div>
  );
};
