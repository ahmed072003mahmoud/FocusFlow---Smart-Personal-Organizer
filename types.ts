
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
  isWorship?: boolean;
  isRunning?: boolean;
  timerStartedAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  streakCount: number;
  history: Record<string, boolean>;
  description: string;
  isCompletedToday: boolean;
  lastCompletedDate: string;
  createdAt: string;
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

export type BehaviorType = 'task_postpone' | 'app_open' | 'task_complete' | 'session_start' | 'update_task_honest' | 'use_ai' | 'daily_completion_check' | 'idle_exit' | 'zen_mode_enter' | 'flow_state_toggle';

export interface BehaviorEvent {
  type: BehaviorType;
  timestamp: string;
  metadata?: any;
}

export interface Idea {
  id: string;
  text: string;
  capturedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  currentStreak: number;
  isActive: boolean;
  isCompleted: boolean;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold';

export interface Badge {
  id: string;
  title: string;
  description: string;
  tier: BadgeTier;
  category: string;
  icon: string;
  isLocked: boolean;
  progress: number;
  unlockedAt?: string;
  isJustUnlocked?: boolean;
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  isGuest: boolean;
  userName?: string;
  email?: string;
  isDarkMode: boolean;
  persona: UserPersona;
  behaviorHistory: BehaviorEvent[];
  badges: Badge[];
  aiUsageCount: number;
  isFlowStateActive: boolean;
  isZenModeActive: boolean;
  zenTaskId: string | null;
  ambientSound: 'none' | 'rain' | 'cafe' | 'white';
  lastVisitDate?: string;
}