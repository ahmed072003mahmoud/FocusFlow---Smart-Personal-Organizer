
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

// BadgeTier defines the visual rank of a badge
export type BadgeTier = 'bronze' | 'silver' | 'gold';

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

// Added Habit interface for tracking ritual streaks
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

// Added Challenge interface for gamified milestones
export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  currentStreak: number;
  isActive: boolean;
  isCompleted: boolean;
}

// Added Idea interface for the Brain Dump inbox
export interface Idea {
  id: string;
  text: string;
  capturedAt: string;
}

// Added SuccessLog interface for tracking high-productivity days
export interface SuccessLog {
  id: string;
  date: string;
  tasksCompleted: number;
  secretSauce: string;
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

export interface Badge {
  id: string;
  title: string;
  description: string;
  tier: BadgeTier;
  category: string;
  icon: string;
  isLocked: boolean;
  progress: number;
  // Metadata for gamification events
  unlockedAt?: string;
  isJustUnlocked?: boolean;
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  challenges: Challenge[];
  successLogs: SuccessLog[];
  ideas: Idea[];
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
  currentWeekMode: WeekMode;
  isSurvivalMode: boolean;
  activeSoftPrompt?: {
    id: string;
    question: string;
    options: string[];
  } | null;
}
