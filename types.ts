
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

export type PlanningMood = 'Energetic' | 'Focused' | 'Tired';

export enum WeekMode {
  STANDARD = 'Standard',
  CRUNCH = 'Crunch',
  LIGHT = 'Light',
  REVIEW = 'Review'
}

export type BadgeTier = 'stability' | 'recovery' | 'restraint';

export type TaskDeferReason = 'low_energy' | 'unclear_task' | 'no_time' | 'procrastination';

// Define BehaviorType to match the events tracked by behavior engines
export type BehaviorType = 'task_complete' | 'task_postpone' | 'zen_mode_enter' | 'use_ai' | 'idle_exit' | 'detox_tasks';

// Habit interface for ritual tracking
export interface Habit {
  id: string;
  name: string;
  streakCount: number;
  isCompletedToday: boolean;
  lastCompletedDate: string;
  createdAt: string;
  description: string;
  history: Record<string, boolean>;
}

// Challenge interface for gamification
export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  currentStreak: number;
  isActive: boolean;
  isCompleted: boolean;
}

// Idea interface for the brain dump inbox
export interface Idea {
  id: string;
  text: string;
  capturedAt: string;
}

// UserPersona interface for behavioral profiling
export interface UserPersona {
  isMorningPerson: boolean;
  avgCompletionTime: string;
  currentMood: PlanningMood;
  dailyIntention: string;
  energyLevel: number;
  isOverloaded: boolean;
  consistencyScore: number;
  energyProfile: 'morning_person' | 'night_owl' | 'mixed';
  completionStyle: 'marathoner' | 'sprinter';
  overwhelmTrigger: number;
  deepWorkHours: number;
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  category: Category;
  priority: Priority;
  estimatedMinutes: number;
  deadline: string;
  postponedCount: number;
  timeSlot?: 'Morning' | 'Afternoon' | 'Evening';
  time?: string;
  createdAt: string;
  priorityScore: number;
  deferReason?: TaskDeferReason;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  tier: BadgeTier;
  category: string;
  icon: string;
  isLocked: boolean;
  unlockedAt?: string;
  // Added properties for UI visualization
  progress: number;
  isJustUnlocked?: boolean;
}

export interface BehaviorEvent {
  type: string;
  timestamp: string;
  metadata?: any;
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  challenges: Challenge[];
  successLogs: any[];
  ideas: Idea[];
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  userName?: string;
  isDarkMode: boolean;
  behaviorHistory: BehaviorEvent[];
  badges: Badge[];
  isZenModeActive: boolean;
  zenTaskId: string | null;
  currentWeekMode: WeekMode;
  isComplexityKillSwitchActive: boolean;
  // State extensions for AI-driven features
  persona: UserPersona;
  suggestion?: string;
  activeSoftPrompt?: { id: string; question: string; options: string[] } | null;
  lastPromptTime?: string;
}
