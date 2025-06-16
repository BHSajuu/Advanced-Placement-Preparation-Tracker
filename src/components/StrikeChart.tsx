import React, { useState } from 'react';
import { UserProgress } from '../types';

interface StrikeChartProps {
  userProgress: UserProgress;
}

export const StrikeChart: React.FC<StrikeChartProps> = ({ userProgress }) => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get days in month accounting for leap years
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Generate day labels (Sun, Mon, etc.)
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get starting day of the month (0 = Sunday)
  const getStartingDay = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Get intensity class based on tasks completed
  const getIntensity = (tasksCompleted: number) => {
    if (tasksCompleted === 0) return 'bg-gray-700 border border-gray-600';
    if (tasksCompleted <= 2) return 'bg-green-900 border border-green-800';
    if (tasksCompleted <= 4) return 'bg-green-700 border border-green-600';
    if (tasksCompleted <= 6) return 'bg-green-500 border border-green-400';
    return 'bg-green-300 border border-green-200';
  };

  // Navigation between months (fixed)
  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Generate calendar grid for current month
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const startDay = getStartingDay(currentYear, currentMonth);
    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="w-6 h-6"></div>);
    }
    
    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const tasksCount = userProgress.dailyHistory[dateStr] || 0;
      
      calendar.push(
        <div
          key={dateStr}
          className={`w-6 h-6 rounded-sm ${getIntensity(tasksCount)} transition-all hover:ring-2 hover:ring-blue-400 cursor-pointer`}
          title={`${dateStr}: ${tasksCount} tasks completed`}
        >
          <span className={`text-xs ${tasksCount > 3 ? 'text-black' : 'text-gray-400'} flex items-center justify-center h-full`}>
            {day}
          </span>
        </div>
      );
    }
    
    return calendar;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6  shadow-lg hover:shadow-lg hover:shadow-blue-300/30 transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-white">Monthly Consistency</h3>
      
      {/* Month navigation */}
      <div className="flex items-center justify-center gap-24 md:gap-56 mb-4">
        <button 
          onClick={() => navigateMonth(-1)}
          className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
        >
          &larr;
        </button>
        <h2 className="text-xl font-bold text-white">
          {months[currentMonth]} {currentYear}
        </h2>
        <button 
          onClick={() => navigateMonth(1)}
          className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
        >
          &rarr;
        </button>
      </div>

      {/* Calendar grid */}
      <div className="lg:w-[500px] text-center grid grid-cols-7  gap-1 justify-items-center mb-4 md:ml-5 lg:ml-[470px] ">
        {dayLabels.map((day) => (
          <div key={day} className="text-xs text-gray-400 font-medium py-1">
            {day}
          </div>
        ))}
        {generateCalendar()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-700 border border-gray-600"></div>
          <div className="w-3 h-3 rounded-sm bg-green-900 border border-green-800"></div>
          <div className="w-3 h-3 rounded-sm bg-green-700 border border-green-600"></div>
          <div className="w-3 h-3 rounded-sm bg-green-500 border border-green-400"></div>
          <div className="w-3 h-3 rounded-sm bg-green-300 border border-green-200"></div>
        </div>
        <span>More</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 p-10 border-t border-gray-700">
        <div className="py-5 text-center shadow-lg hover:shadow-lg hover:shadow-blue-300/30 transition-shadow">
          <div className="text-2xl font-bold text-white">{userProgress.currentStreak}</div>
          <div className="text-sm text-gray-400">Current Streak</div>
        </div>
        <div className="py-5 text-center shadow-lg hover:shadow-lg hover:shadow-blue-300/30 transition-shadow">
          <div className="text-2xl font-bold text-white">{userProgress.longestStreak}</div>
          <div className="text-sm text-gray-400">Longest Streak</div>
        </div>
        <div className="py-5 text-center shadow-lg hover:shadow-lg hover:shadow-blue-300/30 transition-shadow">
          <div className="text-2xl font-bold text-white">{userProgress.completedTasks}</div>
          <div className="text-sm text-gray-400">Total Tasks</div>
        </div>
        <div className="py-5 text-center shadow-lg hover:shadow-lg hover:shadow-blue-300/30 transition-shadow">
          <div className="text-2xl font-bold text-white">
            {Object.values(userProgress.dailyHistory).filter(count => count > 0).length}
          </div>
          <div className="text-sm text-gray-400">Active Days</div>
        </div>
      </div>
    </div>
  );
};
