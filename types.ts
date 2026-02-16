
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
export type AppLanguage = 'ar' | 'en';

export enum WeekMode {
  STANDARD = 'Standard',
  CRUNCH = 'Crunch',
  LIGHT = 'Light',
  REVIEW = 'Review'
}

// Added Challenge interface to resolve import error in constants.tsx
export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  currentStreak: number;
  isActive: boolean;
  isCompleted: boolean;
}

export type BadgeTier = 'stability' | 'recovery' | 'restraint';
export type BehaviorType = 'task_complete' | 'task_postpone' | 'zen_mode_enter' | 'use_ai' | 'idle_exit' | 'detox_tasks' | 'app_open' | 'focus_session_complete';

export interface Habit {
  id: string;
  name: string;
  streakCount: number;
  isCompletedToday: boolean;
  lastCompletedDate: string;
  createdAt: string;
  description: string;
  history: Record<string, boolean>; // date string -> completed
}

export interface FocusSession {
  id: string;
  taskId?: string;
  startTime: string;
  durationMinutes: number;
  actualSeconds: number;
  completed: boolean;
}

export interface Idea {
  id: string;
  text: string;
  capturedAt: string;
}

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
  priorityScore: number; // Calculated dynamically
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
  progress: number;
}

export interface BehaviorEvent {
  type: BehaviorType;
  timestamp: string;
  metadata?: any;
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
  // Added challenges property to resolve state initialization error in AppContext.tsx
  challenges: Challenge[];
  successLogs: any[];
  ideas: Idea[];
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  userName?: string;
  email?: string;
  isGuest: boolean;
  isDarkMode: boolean;
  language: AppLanguage;
  behaviorHistory: BehaviorEvent[];
  badges: Badge[];
  isZenModeActive: boolean;
  zenTaskId: string | null;
  currentWeekMode: WeekMode;
  isComplexityKillSwitchActive: boolean;
  persona: UserPersona;
  lastStrategicCue?: 'overload' | 'procrastination' | 'morning_boost' | null;
}