import React from 'react';
import { Code, Globe, Database, Cpu, Network, MessageSquare, Trophy, Star, Mic, CheckCircle } from 'lucide-react';
import { UserProgress, TaskCategory, Milestone, UserGoals, Task } from '../types';

interface ProgressTrackerProps {
  userProgress: UserProgress;
  milestones: Milestone[];
  userGoals?: UserGoals;
  tasks: Task[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  userProgress,
  userGoals,
  tasks 
}) => {
  const categoryIcons: Record<TaskCategory, React.ReactNode> = {
    'DSA': <Code className="w-5 h-5" />,
    'Web Dev': <Globe className="w-5 h-5" />,
    'Data Science': <Database className="w-5 h-5" />,
    'CS Fundamentals': <Cpu className="w-5 h-5" />,
    'System Design': <Network className="w-5 h-5" />,
    'Mock Interview': <MessageSquare className="w-5 h-5" />,
    'English Speaking Practice': <Mic className="w-5 h-5" />
  };

  const categoryColors: Record<TaskCategory, string> = {
    'DSA': 'from-blue-500 to-blue-600',
    'Web Dev': 'from-green-500 to-green-600',
    'Data Science': 'from-purple-500 to-purple-600',
    'CS Fundamentals': 'from-red-500 to-red-600',
    'System Design': 'from-yellow-500 to-yellow-600',
    'Mock Interview': 'from-pink-500 to-pink-600',
    'English Speaking Practice': 'from-indigo-500 to-indigo-600'
  };

  const getXPForNextLevel = (level: number) => level * 1000;
  const currentLevelXP = (userProgress.level - 1) * 1000;
  const nextLevelXP = getXPForNextLevel(userProgress.level);
  const progressToNextLevel = ((userProgress.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  // Calculate smart progress based on goals
  const calculateSmartProgress = () => {
    if (!userGoals) return [];

    const completedTasks = tasks.filter(task => task.completed);
    
    const progress = [
      {
        category: 'DSA' as TaskCategory,
        target: userGoals.dsaQuestions,
        current: Object.values(userProgress.dsaQuestionsHistory).reduce((sum, count) => sum + count, 0),
        unit: 'questions',
        items: [],
        completedItems: []
      },
      {
        category: 'Web Dev' as TaskCategory,
        target: userGoals.webDevProjects.length,
        current: userGoals.webDevProjects.filter(project => 
          completedTasks.some(task => task.category === 'Web Dev' && task.projectName === project)
        ).length,
        unit: 'projects',
        items: userGoals.webDevProjects,
        completedItems: userGoals.webDevProjects.filter(project => 
          completedTasks.some(task => task.category === 'Web Dev' && task.projectName === project)
        )
      },
      {
        category: 'System Design' as TaskCategory,
        target: userGoals.systemDesignCases.length,
        current: userGoals.systemDesignCases.filter(caseStudy => 
          completedTasks.some(task => task.category === 'System Design' && task.caseStudyName === caseStudy)
        ).length,
        unit: 'case studies',
        items: userGoals.systemDesignCases,
        completedItems: userGoals.systemDesignCases.filter(caseStudy => 
          completedTasks.some(task => task.category === 'System Design' && task.caseStudyName === caseStudy)
        )
      },
      {
        category: 'Mock Interview' as TaskCategory,
        target: userGoals.mockInterviews,
        current: completedTasks
          .filter(task => task.category === 'Mock Interview')
          .reduce((sum, task) => sum + (task.sessionCount || 1), 0),
        unit: 'sessions',
        items: [],
        completedItems: []
      },
      {
        category: 'Data Science' as TaskCategory,
        target: userGoals.dataScienceTutorials,
        current: completedTasks
          .filter(task => task.category === 'Data Science')
          .reduce((sum, task) => sum + (task.tutorialCount || 1), 0),
        unit: 'tutorials',
        items: [],
        completedItems: []
      },
      {
        category: 'CS Fundamentals' as TaskCategory,
        target: userGoals.csFundamentalsChapters.length,
        current: userGoals.csFundamentalsChapters.filter(chapter => 
          completedTasks.some(task => task.category === 'CS Fundamentals' && task.chapterName === chapter)
        ).length,
        unit: 'chapters',
        items: userGoals.csFundamentalsChapters,
        completedItems: userGoals.csFundamentalsChapters.filter(chapter => 
          completedTasks.some(task => task.category === 'CS Fundamentals' && task.chapterName === chapter)
        )
      },
      {
        category: 'English Speaking Practice' as TaskCategory,
        target: userGoals.englishSpeakingSessions,
        current: completedTasks
          .filter(task => task.category === 'English Speaking Practice')
          .reduce((sum, task) => sum + (task.sessionCount || 1), 0),
        unit: 'sessions',
        items: [],
        completedItems: []
      }
    ];

    return progress;
  };

  const smartProgress = calculateSmartProgress();
  const totalDSAQuestions = Object.values(userProgress.dsaQuestionsHistory).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Level and XP Progress */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Level {userProgress.level}</h3>
              <p className="text-purple-100">XP: {userProgress.totalXP.toLocaleString()}</p>
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


       {/* DSA Questions Summary */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg text-white">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">DSA Progress</h3>
            <p className="text-gray-400">Total questions solved: {totalDSAQuestions}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{totalDSAQuestions}</div>
            <div className="text-sm text-gray-400">Total Questions</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {Object.values(userProgress.dsaQuestionsHistory).filter(count => count > 0).length}
            </div>
            <div className="text-sm text-gray-400">Active Days</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(totalDSAQuestions / Math.max(Object.values(userProgress.dsaQuestionsHistory).filter(count => count > 0).length, 1))}
            </div>
            <div className="text-sm text-gray-400">Avg per Day</div>
          </div>
        </div>
      </div>


      {/* Smart Goal Progress */}
      {userGoals && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Goal Progress (Smart Tracking)
          </h3>
          
          <div className="grid gap-4">
            {smartProgress.map((progress) => (
              <div key={progress.category} className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`bg-gradient-to-r ${categoryColors[progress.category]} p-2 rounded-lg text-white`}>
                    {categoryIcons[progress.category]}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">{progress.category}</h4>
                    <p className="text-gray-400 text-sm">
                      {progress.current} of {progress.target} {progress.unit} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {Math.round((progress.current / progress.target) * 100)}%
                    </div>
                    <div className="text-xs text-gray-400">Complete</div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-full h-3 mb-4">
                  <div 
                    className={`bg-gradient-to-r ${categoryColors[progress.category]} rounded-full h-full transition-all duration-500`}
                    style={{ width: `${Math.min((progress.current / progress.target) * 100, 100)}%` }}
                  />
                </div>

                {/* Show detailed progress for categories with items */}
                {progress.items && progress.items.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-300">Detailed Progress:</h5>
                    <div className="grid gap-2">
                      {progress.items.map((item, index) => {
                        const isCompleted = progress.completedItems?.includes(item);
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                              isCompleted 
                                ? 'bg-green-900/30 text-green-200' 
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <div className="w-4 h-4 border border-gray-500 rounded-full" />
                            )}
                            <span className={isCompleted ? 'line-through' : ''}>{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};