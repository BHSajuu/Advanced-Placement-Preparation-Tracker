export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  timeSlot: TimeSlot;
  completed: boolean;
  xp: number;
  createdAt: Date;
  completedAt?: Date;
  questionsCount?: number; // For DSA tasks
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'milestone' | 'xp' | 'daily';
  icon: string;
  unlockedAt: Date;
}

export interface UserProgress {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  completedTasks: number;
  achievements: Achievement[];
  dailyHistory: Record<string, number>; // date -> tasks completed
  dsaQuestionsHistory: Record<string, number>; // date -> DSA questions solved
}

export type TaskCategory = 'DSA' | 'Web Dev' | 'Data Science' | 'CS Fundamentals' | 'System Design' | 'Mock Interview' | 'English Speaking Practice';

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening';

export interface DailyPlan {
  date: string;
  tasks: Task[];
  completed: number;
  total: number;
}