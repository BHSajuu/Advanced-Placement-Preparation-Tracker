export type TaskCategory = 
  | 'DSA' 
  | 'Web Dev' 
  | 'Data Science' 
  | 'CS Fundamentals' 
  | 'System Design' 
  | 'Mock Interview' 
  | 'English Speaking Practice';

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  timeSlot: TimeSlot;
  xp: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  questionsCount?: number;
  dsaTopicName?: string;
  dataScienceTopicName?: string;
  projectName?: string;
  caseStudyName?: string;
  tutorialCount?: number;
  sessionCount?: number;
  chapterName?: string;
}

export interface UserProgress {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  completedTasks: number;
  achievements: Achievement[];
  dailyHistory: Record<string, number>;
  dsaQuestionsHistory: Record<string, number>;
  dsaTopicsProgress: Record<string, { questionsCompleted: number; totalQuestions: number; completed: boolean }>;
  dsTopicProgress: Record<string, { tutorialsCompleted: number; totalTutorials: number; completed: boolean }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'milestone' | 'streak' | 'topic' | 'xp';
  icon: string;
  unlockedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  target: number;
  current: number;
  xp: number;
  completed: boolean;
}

export interface DSATopic {
  name: string;
  targetQuestions: number;
}

export interface DSTopic {
  name: string;
  targetTutorials: number;
}

export interface UserGoals {
  dsaQuestions: number;
  dsaTopics: DSATopic[];
  webDevProjects: string[];
  systemDesignCases: string[];
  mockInterviews: number;
  dataScienceTutorials: number;
  dataScienceTopics: DSTopic[];
  csFundamentalsChapters: string[];
  englishSpeakingSessions: number;
}

export interface GoalProgress {
  category: TaskCategory;
  target: number;
  current: number;
  unit: string;
  items?: string[];
  completedItems?: string[];
}