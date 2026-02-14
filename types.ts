
export enum Category {
  STUDY = 'Study',
  HABIT = 'Habit',
  PRAYER = 'Prayer',
  WORK = 'Work',
  OTHER = 'Other'
}

export enum Priority {
  HIGH = 'High',
  NORMAL = 'Normal'
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  deadline: string; 
  scheduledTime?: string; 
  time?: string;
  priority?: Priority;
  estimatedMinutes: number;
  actualMinutes: number;
  isRunning: boolean;
  lastStartTime?: string;
  postponedCount: number;
  category: Category;
  createdAt: string;
  priorityScore: number; 
  failureReason?: string;
  isFixedTime: boolean;
  isWorship: boolean; 
}

export interface Idea {
  id: string;
  text: string;
  capturedAt: string;
}

export interface SuccessLog {
  id: string;
  date: string;
  tasksCompleted: number;
  secretSauce: string;
  productivityScore: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  currentStreak: number;
  isActive: boolean;
  isCompleted: boolean;
  lastProcessedDate?: string; 
}

export type Language = 'en' | 'ar';

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  challenges: Challenge[]; 
  ideas: Idea[];
  successLogs: SuccessLog[];
  userName: string;
  selectedGoals: string[];
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  notificationsEnabled: boolean;
  isDarkMode: boolean; // NEW
  language: Language;
  dailyAvailableMinutes: number;
  isSurvivalMode: boolean; 
  isBadDayMode: boolean;
  dailyIntention?: string;
  intentionDate?: string;
  categoryBias: Record<string, number>;
}

export interface Habit {
  id: string;
  name: string;
  streakCount: number;
  isCompletedToday: boolean;
  lastCompletedDate?: string;
  createdAt: string;
  description: string;
  history: string[]; 
}
