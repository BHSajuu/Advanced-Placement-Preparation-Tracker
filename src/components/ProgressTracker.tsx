import React, { useState } from 'react';
import {
  Code,
  Globe,
  Database,
  Cpu,
  Network,
  MessageSquare,
  Mic,
  Trophy,
  Star
} from 'lucide-react';
import { UserProgress, TaskCategory, Milestone, Task } from '../types';

interface ProgressTrackerProps {
  userProgress: UserProgress;
  milestones: Milestone[];
  tasks: Task[];
  onUpdateMilestone: (id: string, newTarget: number) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  userProgress,
  milestones,
  tasks,
  onUpdateMilestone
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTarget, setTempTarget] = useState<number>(0);

  const categoryIcons: Record<TaskCategory, React.ReactNode> = {
    DSA: <Code className="w-5 h-5" />,
    'Web Dev': <Globe className="w-5 h-5" />,
    'Data Science': <Database className="w-5 h-5" />,
    'CS Fundamentals': <Cpu className="w-5 h-5" />,
    'System Design': <Network className="w-5 h-5" />,
    'Mock Interview': <MessageSquare className="w-5 h-5" />,
    'English Speaking Practice': <Mic className="w-5 h-5" />
  };

  const categoryColors: Record<TaskCategory, string> = {
    DSA: 'from-blue-500 to-blue-600',
    'Web Dev': 'from-green-500 to-green-600',
    'Data Science': 'from-purple-500 to-purple-600',
    'CS Fundamentals': 'from-red-500 to-red-600',
    'System Design': 'from-yellow-500 to-yellow-600',
    'Mock Interview': 'from-pink-500 to-pink-600',
    'English Speaking Practice': 'from-indigo-500 to-indigo-600'
  };

  // XP / Level
  const getXPForNextLevel = (level: number) => level * 1000;
  const currentLevelXP = (userProgress.level - 1) * 1000;
  const nextLevelXP = getXPForNextLevel(userProgress.level);
  const progressToNextLevel =
    ((userProgress.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  // Group milestones
  const groupedMilestones = milestones.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<TaskCategory, Milestone[]>);

  // Total DSA questions solved
  const totalDSAQuestions = Object.values(userProgress.dsaQuestionsHistory).reduce(
    (sum, c) => sum + c,
    0
  );

  // Inline editing handlers
  const startEdit = (id: string, currentTarget: number) => {
    setEditingId(id);
    setTempTarget(currentTarget);
  };
  const finishEdit = (id: string) => {
    onUpdateMilestone(id, tempTarget);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Level & XP Panel */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Level {userProgress.level}</h3>
              <p className="text-purple-100">
                XP: {userProgress.totalXP.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-100">Next Level</p>
            <p className="font-semibold">{nextLevelXP.toLocaleString()} XP</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-full h-3 mb-2">
          <div
            className="bg-white rounded-full h-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-purple-100">
          <span>{Math.round(progressToNextLevel)}% to next level</span>
          <span>{nextLevelXP - userProgress.totalXP} XP remaining</span>
        </div>
      </div>

      {/* DSA Summary */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg text-white">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">DSA Progress</h3>
            <p className="text-gray-400">
              Total questions solved: {totalDSAQuestions}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{totalDSAQuestions}</div>
            <div className="text-sm text-gray-400">Total Questions</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {
                Object.values(userProgress.dsaQuestionsHistory).filter(c => c > 0)
                  .length
              }
            </div>
            <div className="text-sm text-gray-400">Active Days</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(
                totalDSAQuestions /
                  Math.max(
                    Object.values(userProgress.dsaQuestionsHistory).filter(
                      c => c > 0
                    ).length,
                    1
                  )
              )}
            </div>
            <div className="text-sm text-gray-400">Avg per Day</div>
          </div>
        </div>
      </div>

      {/* Skills Progress */}
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Skills Progress
        </h3>

        {(Object.entries(groupedMilestones) as [TaskCategory, Milestone[]][]).map(
          ([category, ms]) => {
            return (
              <div key={category} className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`bg-gradient-to-r ${categoryColors[category]} p-2 rounded-lg text-white`}
                  >
                    {categoryIcons[category]}
                  </div>
                  <h4 className="text-lg font-semibold text-white">{category}</h4>
                </div>

                <div className="space-y-3">
                  {ms.map(m => {
                    const current =
                      category === 'DSA'
                        ? totalDSAQuestions
                        : tasks.filter(
                            t => t.category === category && t.completed
                          ).length;
                    const target =
                      category === 'DSA'
                        ? m.target
                        : tasks.filter(t => t.category === category).length;
                    const pct = Math.round((current / Math.max(target, 1)) * 100);

                    return (
                      <div key={m.id} className="border-l-4 border-blue-400 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-white">{m.title}</h5>
                          {editingId === m.id ? (
                            <input
                              type="number"
                              className="w-16 px-2 py-1 rounded border border-gray-600 bg-gray-700 text-white"
                              value={tempTarget}
                              onChange={e =>
                                setTempTarget(parseInt(e.target.value) || 0)
                              }
                              onBlur={() => finishEdit(m.id)}
                              onKeyDown={e =>
                                e.key === 'Enter' && finishEdit(m.id)
                              }
                              autoFocus
                            />
                          ) : (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                current >= target
                                  ? 'bg-green-800 text-green-100'
                                  : 'bg-gray-700 text-gray-300'
                              } flex items-center gap-1 cursor-pointer`}
                              onClick={() => startEdit(m.id, m.target)}
                            >
                              {current}/{target} Q <span>✎</span>
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-400 mb-2">
                          {category === 'DSA'
                            ? `Solve ${m.target} DSA problems`
                            : `Complete your ${category} projects`}
                        </p>

                        <div className="bg-gray-700 rounded-full h-2 mb-2">
                          <div
                            className={`bg-gradient-to-r ${categoryColors[category]} rounded-full h-full transition-all duration-500`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>{pct}% Complete</span>
                          <span>{m.xp} XP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};