import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dashboard } from './components/Dashboard';
import { TaskManager } from './components/TaskManager';
import { ProgressTracker } from './components/ProgressTracker';
import { StrikeChart } from './components/StrikeChart';
import { RewardPopup } from './components/RewardPopup';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, UserProgress, Milestone, Achievement, UserGoals } from './types';
import { BarChart3, CheckSquare, Target, Activity } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [startDate, setStartDate] = useLocalStorage('prep-start-date', new Date().toISOString());
  const [tasks, setTasks] = useLocalStorage<Task[]>('prep-tasks', []);
  const [userGoals, setUserGoals] = useLocalStorage<UserGoals | undefined>('prep-user-goals', undefined);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('prep-progress', {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    completedTasks: 0,
    achievements: [],
    dailyHistory: {},
    dsaQuestionsHistory: {},
    dsaTopicsProgress: {}
  });

  const [milestones, setMilestones] = useLocalStorage<Milestone[]>('prep-milestones', [
    {
      id: uuidv4(),
      title: 'DSA Foundation',
      description: 'Complete 400 DSA problems',
      category: 'DSA',
      target: 400,
      current: 0,
      xp: 500,
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Web Development Project',
      description: 'Build and deploy a full-stack application',
      category: 'Web Dev',
      target: 5,
      current: 0,
      xp: 1000,
      completed: false
    },
    {
      id: uuidv4(),
      title: 'System Design Mastery',
      description: 'Complete 10 system design case studies',
      category: 'System Design',
      target: 10,
      current: 0,
      xp: 800,
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Mock Interview Champion',
      description: 'Complete 20 mock interviews with good feedback',
      category: 'Mock Interview',
      target: 20,
      current: 0,
      xp: 600,
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Data Science Basics',
      description: 'Finish 100 data science tutorials',
      category: 'Data Science',
      target: 100,
      current: 0,
      xp: 700,
      completed: false
    },
    {
      id: uuidv4(),
      title: 'CS Fundamentals Core',
      description: 'Master 15 CS fundamentals topics',
      category: 'CS Fundamentals',
      target: 15,
      current: 0,
      xp: 700,
      completed: false
    },
    {
      id: uuidv4(),
      title: 'English Speaking Fluency',
      description: 'Complete 30 English speaking practice sessions',
      category: 'English Speaking Practice',
      target: 30,
      current: 0,
      xp: 400,
      completed: false
    }
  ]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date()
    };
    setTasks([...tasks, newTask]);
  };

  const calculateSmartProgress = (task: Task, isCompleting: boolean) => {
    if (!userGoals) return 0;

    switch (task.category) {
      case 'DSA':
        return task.questionsCount || 1;
      case 'Web Dev':
        // Only count if it's a project completion
        return task.projectName ? 1 : 0;
      case 'System Design':
        // Only count if it's a case study completion
        return task.caseStudyName ? 1 : 0;
      case 'Data Science':
        return task.tutorialCount || 1;
      case 'Mock Interview':
      case 'English Speaking Practice':
        return task.sessionCount || 1;
      case 'CS Fundamentals':
        // Only count if it's a chapter completion
        return task.chapterName ? 1 : 0;
      default:
        return 1;
    }
  };

  const updateDSATopicProgress = (task: Task, isCompleting: boolean) => {
    if (task.category !== 'DSA' || !task.dsaTopicName || !userGoals?.dsaTopics) return;

    const newProgress = { ...userProgress };
    const topicName = task.dsaTopicName;
    const questionsCount = task.questionsCount || 1;

    if (!newProgress.dsaTopicsProgress[topicName]) {
      const topic = userGoals.dsaTopics.find(t => t.name === topicName);
      newProgress.dsaTopicsProgress[topicName] = {
        questionsCompleted: 0,
        totalQuestions: topic?.targetQuestions || 0,
        completed: false
      };
    }

    const topicProgress = newProgress.dsaTopicsProgress[topicName];

    if (isCompleting) {
      topicProgress.questionsCompleted += questionsCount;
      
      // Check if topic is completed for the first time
      if (!topicProgress.completed && topicProgress.questionsCompleted >= topicProgress.totalQuestions) {
        topicProgress.completed = true;
        
        // Award topic completion achievement
        const achievement: Achievement = {
          id: uuidv4(),
          title: `${topicName} Mastered!`,
          description: `Completed all questions in ${topicName}`,
          type: 'topic',
          icon: 'trophy',
          unlockedAt: new Date()
        };
        newProgress.achievements.push(achievement);
        newProgress.totalXP += 150; // Bonus XP for topic completion
        setCurrentAchievement(achievement);
      }
    } else {
      topicProgress.questionsCompleted = Math.max(0, topicProgress.questionsCompleted - questionsCount);
      if (topicProgress.completed && topicProgress.questionsCompleted < topicProgress.totalQuestions) {
        topicProgress.completed = false;
        newProgress.totalXP = Math.max(0, newProgress.totalXP - 150); // Remove bonus XP
      }
    }

    setUserProgress(newProgress);
  };

  const checkDailyMilestones = (todayTasks: Task[], newProgress: UserProgress) => {
    const today = new Date().toISOString().split('T')[0];
    const todayCompletedTasks = todayTasks.filter(task =>
      task.completed &&
      task.completedAt &&
      task.completedAt.toISOString().split('T')[0] === today
    );

    // Check for daily achievements
    const dsaTasks = todayCompletedTasks.filter(task => task.category === 'DSA').length;
    const webDevTasks = todayCompletedTasks.filter(task => task.category === 'Web Dev').length;
    const totalTodayTasks = todayCompletedTasks.length;

    // DSA Daily Milestones - Updated to check for 10 DSA problems
    if (dsaTasks >= 10 && !newProgress.achievements.some(a => a.title === 'DSA Daily Champion' && a.unlockedAt.toISOString().split('T')[0] === today)) {
      const achievement: Achievement = {
        id: uuidv4(),
        title: 'DSA Daily Champion',
        description: 'Solved 10+ DSA problems in a day!',
        type: 'daily',
        icon: 'trophy',
        unlockedAt: new Date()
      };
      newProgress.achievements.push(achievement);
      newProgress.totalXP += 100;
      setCurrentAchievement(achievement);
    }

    // Web Dev Daily Milestone
    if (webDevTasks >= 3 && !newProgress.achievements.some(a => a.title === 'Web Dev Daily Master' && a.unlockedAt.toISOString().split('T')[0] === today)) {
      const achievement: Achievement = {
        id: uuidv4(),
        title: 'Web Dev Daily Master',
        description: 'Completed 3+ Web Dev tasks in a day!',
        type: 'daily',
        icon: 'trophy',
        unlockedAt: new Date()
      };
      newProgress.achievements.push(achievement);
      newProgress.totalXP += 100;
      setCurrentAchievement(achievement);
    }

    // Productivity Milestone
    if (totalTodayTasks >= 10 && !newProgress.achievements.some(a => a.title === 'Productivity Beast' && a.unlockedAt.toISOString().split('T')[0] === today)) {
      const achievement: Achievement = {
        id: uuidv4(),
        title: 'Productivity Beast',
        description: 'Completed 10+ tasks in a single day!',
        type: 'daily',
        icon: 'trophy',
        unlockedAt: new Date()
      };
      newProgress.achievements.push(achievement);
      newProgress.totalXP += 200;
      setCurrentAchievement(achievement);
    }
  };

  const toggleTask = (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date() : undefined
    };

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    setTasks(updatedTasks);

    // Update progress
    const today = new Date().toISOString().split('T')[0];
    let newProgress = { ...userProgress };

    if (!task.completed) {
      // Task completed
      newProgress.totalXP += task.xp;
      newProgress.completedTasks += 1;
      newProgress.level = Math.floor(newProgress.totalXP / 1000) + 1;

      // Update daily history
      newProgress.dailyHistory[today] = (newProgress.dailyHistory[today] || 0) + 1;

      // Update DSA questions history if it's a DSA task
      if (task.category === 'DSA' && task.questionsCount) {
        newProgress.dsaQuestionsHistory[today] = (newProgress.dsaQuestionsHistory[today] || 0) + task.questionsCount;
      }

      // Update DSA topic progress
      updateDSATopicProgress(task, true);

      // Update milestones with smart progress calculation
      const smartProgressIncrement = calculateSmartProgress(task, true);
      const relatedMilestones = milestones.filter(m => m.category === task.category);
      relatedMilestones.forEach(milestone => {
        if (!milestone.completed && milestone.current < milestone.target) {
          milestone.current += smartProgressIncrement;
          if (milestone.current >= milestone.target) {
            milestone.completed = true;
            newProgress.totalXP += milestone.xp;

            // Create achievement
            const achievement: Achievement = {
              id: uuidv4(),
              title: `${milestone.title} Complete!`,
              description: milestone.description,
              type: 'milestone',
              icon: 'trophy',
              unlockedAt: new Date()
            };
            newProgress.achievements.push(achievement);
            setCurrentAchievement(achievement);
          }
        }
      });

      // Update streak: only on first completion of the day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      // prev count before this completion
      const prevTodayCount = (newProgress.dailyHistory[today] || 1) - 1;
      if (prevTodayCount === 0) {
        const yesterdayCount = newProgress.dailyHistory[yesterdayStr] || 0;
        if (yesterdayCount > 0) {
          newProgress.currentStreak += 1;
        } else {
          newProgress.currentStreak = 1;
        }
        newProgress.longestStreak = Math.max(newProgress.longestStreak, newProgress.currentStreak);
        // Streak achievements
        if (newProgress.currentStreak === 7) {
          const achievement: Achievement = {
            id: uuidv4(),
            title: 'Week Warrior',
            description: 'Maintained a 7-day streak!',
            type: 'streak',
            icon: 'flame',
            unlockedAt: new Date()
          };
          newProgress.achievements.push(achievement);
          setCurrentAchievement(achievement);
        }
      }

      // Check daily milestones
      checkDailyMilestones(updatedTasks, newProgress);

    } else {
      // Task uncompleted
      newProgress.totalXP = Math.max(0, newProgress.totalXP - task.xp);
      newProgress.completedTasks = Math.max(0, newProgress.completedTasks - 1);
      newProgress.level = Math.floor(newProgress.totalXP / 1000) + 1;

      // Update daily history
      newProgress.dailyHistory[today] = Math.max(0, (newProgress.dailyHistory[today] || 0) - 1);

      // Update DSA questions history if it's a DSA task
      if (task.category === 'DSA' && task.questionsCount) {
        newProgress.dsaQuestionsHistory[today] = Math.max(0, (newProgress.dsaQuestionsHistory[today] || 0) - task.questionsCount);
      }

      // Update DSA topic progress
      updateDSATopicProgress(task, false);

      // Reverse milestone progress
      const smartProgressDecrement = calculateSmartProgress(task, false);
      const relatedMilestones = milestones.filter(m => m.category === task.category);
      relatedMilestones.forEach(milestone => {
        milestone.current = Math.max(0, milestone.current - smartProgressDecrement);
        if (milestone.completed && milestone.current < milestone.target) {
          milestone.completed = false;
          newProgress.totalXP = Math.max(0, newProgress.totalXP - milestone.xp);
        }
      });
    }

    setUserProgress(newProgress);
    setMilestones([...milestones]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const updateGoals = (goals: UserGoals) => {
    setUserGoals(goals);
  };

  const resetJourney = () => {
    // Clear all localStorage data
    localStorage.removeItem('prep-start-date');
    localStorage.removeItem('prep-tasks');
    localStorage.removeItem('prep-progress');
    localStorage.removeItem('prep-milestones');
    localStorage.removeItem('prep-user-goals');

    // Reset all state to initial values
    setStartDate(new Date().toISOString());
    setTasks([]);
    setUserGoals(undefined);
    setUserProgress({
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      completedTasks: 0,
      achievements: [],
      dailyHistory: {},
      dsaQuestionsHistory: {},
      dsaTopicsProgress: {}
    });
    setMilestones([
      {
        id: uuidv4(),
        title: 'DSA Foundation',
        description: 'Complete 400 DSA problems',
        category: 'DSA',
        target: 400,
        current: 0,
        xp: 500,
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Web Development Project',
        description: 'Build and deploy a full-stack application',
        category: 'Web Dev',
        target: 5,
        current: 0,
        xp: 1000,
        completed: false
      },
      {
        id: uuidv4(),
        title: 'System Design Mastery',
        description: 'Complete 10 system design case studies',
        category: 'System Design',
        target: 10,
        current: 0,
        xp: 800,
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Mock Interview Champion',
        description: 'Complete 20 mock interviews with good feedback',
        category: 'Mock Interview',
        target: 20,
        current: 0,
        xp: 600,
        completed: false
      },
      {
        id: uuidv4(),
        title: 'Data Science Basics',
        description: 'Finish 100 data science tutorials',
        category: 'Data Science',
        target: 100,
        current: 0,
        xp: 700,
        completed: false
      },
      {
        id: uuidv4(),
        title: 'CS Fundamentals Core',
        description: 'Master 15 CS fundamentals topics',
        category: 'CS Fundamentals',
        target: 15,
        current: 0,
        xp: 700,
        completed: false
      },
      {
        id: uuidv4(),
        title: 'English Speaking Fluency',
        description: 'Complete 30 English speaking practice sessions',
        category: 'English Speaking Practice',
        target: 30,
        current: 0,
        xp: 400,
        completed: false
      }
    ]);
    setCurrentAchievement(null);
    setActiveTab('dashboard');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <Target className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="bg-gray-800 rounded-xl shadow-lg mb-8 p-1">
          <nav className="flex flex-nowrap overflow-x-auto md:overflow-hidden space-x-4 lg:space-x-16 px-2 no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="transition-all duration-300">
          {activeTab === 'dashboard' && (
            <Dashboard
              userProgress={userProgress}
              startDate={new Date(startDate)}
              userGoals={userGoals}
              onResetJourney={resetJourney}
              onUpdateGoals={updateGoals}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskManager
              tasks={tasks}
              userGoals={userGoals}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTracker
              userProgress={userProgress}
              milestones={milestones}
              userGoals={userGoals}
              tasks={tasks}
            />
          )}

          {activeTab === 'activity' && (
            <StrikeChart userProgress={userProgress} />
          )}
        </div>
      </div>

      {/* Reward Popup */}
      <RewardPopup
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
    </div>
  );
}

export default App;
