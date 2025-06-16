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

  // Calculate DSA topic-wise progress using persistent storage
  const calculateDSATopicProgress = () => {
    if (!userGoals?.dsaTopics) return [];

    return userGoals.dsaTopics.map(topic => {
      const progress = userProgress.dsaTopicsProgress[topic.name] || { questionsCompleted: 0, totalQuestions: topic.targetQuestions, completed: false };
      const { questionsCompleted, totalQuestions, completed } = progress;
      return {
        name: topic.name,
        targetQuestions: totalQuestions,
        questionsCompleted,
        completed,
        progressPercentage: Math.min((questionsCompleted / totalQuestions) * 100, 100)
      };
    });
  };

  // Calculate Data Science topic-wise progress using persistent storage
  const calculateDSTopicProgress = () => {
    if (!userGoals?.dataScienceTopics) return [];

    return userGoals.dataScienceTopics.map(topic => {
      const progress = userProgress.dsTopicProgress[topic.name] || { tutorialsCompleted: 0, totalTutorials: topic.targetTutorials, completed: false };
      const { tutorialsCompleted, totalTutorials, completed } = progress;
      return {
        name: topic.name,
        targetTutorials: totalTutorials,
        tutorialsDone: tutorialsCompleted,
        completed,
        progressPercentage: Math.min((tutorialsCompleted / totalTutorials) * 100, 100)
      };
    });
  };

  const smartProgress = calculateSmartProgress();
  const dsaTopicProgress = calculateDSATopicProgress();
  const dsTopicProgress = calculateDSTopicProgress();
  const totalDSAQuestions = Object.values(userProgress.dsaQuestionsHistory).reduce((sum, count) => sum + count, 0);


  // Calculate additional DSA statistics
  const dsaQuestionsArray = Object.values(userProgress.dsaQuestionsHistory);
  const activeDSADays = dsaQuestionsArray.filter(count => count > 0).length;
  const avgQuestionsPerDay = activeDSADays > 0 ? (totalDSAQuestions / activeDSADays).toFixed(1) : '0';
  const maxQuestionsInDay = Math.max(...dsaQuestionsArray, 0);

  return (
    <div className="space-y-6">
      {/* Level and XP Progress */}
      <div className="bg-gradient-to-r from-slate-800 to-[#7886C7] rounded-xl p-6 text-white shadow-lg hover:shadow-lg hover:shadow-blue-300/30 transition-shadow hover:cursor-pointer">
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
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-lg hover:shadow-blue-300/30 transition-shadow hover:cursor-pointer">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg text-white">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">DSA Progress Summary</h3>
            <p className="text-gray-400">Total questions solved: {totalDSAQuestions}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{totalDSAQuestions}</div>
            <div className="text-sm text-gray-400">Total Questions</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {dsaTopicProgress.filter(topic => topic.completed).length}
            </div>
            <div className="text-sm text-gray-400">Topics Completed</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {activeDSADays}
            </div>
            <div className="text-sm text-gray-400">Active Days</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {avgQuestionsPerDay}
            </div>
            <div className="text-sm text-gray-400">Avg Questions/Day</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">
              {maxQuestionsInDay}
            </div>
            <div className="text-sm text-gray-400">Max Questions/Day</div>
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

          <div className="grid gap-6">
            {smartProgress.map((progress) => (
              <div key={progress.category} className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-lg hover:shadow-blue-300/30 transition-shadow hover:cursor-pointer">
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
                    <div className="grid gap-4 lg:pl-10">
                      {progress.items.map((item, index) => {
                        const isCompleted = progress.completedItems?.includes(item);
                        return (
                          <div
                            key={index}
                            className={`flex w-[300px] lg:w-[1300px] items-center gap-2 p-2 hover:scale-105 transition-transform ease-linear duration-300 rounded-lg text-sm ${isCompleted
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

      {/* Advanced DSA Topic Progress */}
      {userGoals?.dsaTopics && dsaTopicProgress.length > 0 && (
        <div className="space-y-4 pt-5">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-500" />
            DSA Topic-wise Progress
          </h3>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-lg hover:shadow-blue-300/30 transition-shadow hover:cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
              {dsaTopicProgress.map((topic, index) => (
                <div key={index} className="py-2 border-l-4  border-blue-500 px-2 lg:px-4 lg:mx-10 my-2 hover:scale-105 transition-transform ease-linear hover:shadow-lg hover:shadow-blue-300/30  hover:cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-white">{topic.name}</h5>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${topic.completed
                        ? 'bg-green-800 text-green-100'
                        : 'bg-gray-700 text-gray-300'
                        }`}>
                        {topic.questionsCompleted}/{topic.targetQuestions} Q
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-full transition-all duration-500"
                      style={{ width: `${topic.progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{Math.round(topic.progressPercentage)}% Complete</span>
                    <span>
                      {topic.targetQuestions - topic.questionsCompleted > 0
                        ? `${topic.targetQuestions - topic.questionsCompleted} questions remaining`
                        : 'Topic completed!'
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Data Science Topic Progress */}
      {userGoals?.dataScienceTopics && dsTopicProgress.length > 0 && (
        <div className="space-y-4 pt-5">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-500" />
            Data Science Topic‑wise Progress
          </h3>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-lg hover:shadow-blue-300/60 transition-shadow hover:cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-5">
              {dsTopicProgress.map((topic, i) => (
                <div key={i} className=" py-2 border-l-4 border-purple-500 px-2 lg:px-4 lg:mx-10 my-2 hover:scale-105 transition-transform ease-linear hover:shadow-lg hover:shadow-blue-300/30  hover:cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white w-60">{topic.name}</h5>
                    <span className={`px-2 py-2 rounded-full text-xs font-semibold ${topic.completed
                        ? 'bg-green-800 text-green-100'
                        : 'bg-gray-700 text-gray-300'
                      }`}>
                      {topic.tutorialsDone}/{topic.targetTutorials} Tuts
                    </span>
                  </div>

                  <div className="bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full h-full transition-all duration-500"
                      style={{ width: `${topic.progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{Math.round(topic.progressPercentage)}% Complete</span>
                    <span>
                      {topic.targetTutorials - topic.tutorialsDone > 0
                        ? `${topic.targetTutorials - topic.tutorialsDone} tuts remaining`
                        : 'Topic completed!'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};