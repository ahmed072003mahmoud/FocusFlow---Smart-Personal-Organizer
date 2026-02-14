
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { Task, Habit, AppState, Category, Language, Priority, Challenge, SuccessLog, Idea, WeekMode } from './types';
import { INITIAL_HABITS, TRANSLATIONS, GOAL_TASK_MAPPING, DEFAULT_CHALLENGES } from './constants';
import { SmartTaskParser } from './utils/SmartTaskParser';
import { GoogleGenAI } from "@google/genai";

interface OverloadInfo {
  isOverloaded: boolean;
  excessMinutes: number;
  suggestedToPostpone: Task[];
  totalTaskMinutes: number;
}

interface RealityCheckResult {
  taskId: string;
  actual: number;
  estimated: number;
  type: 'fallacy' | 'speedy' | 'on-point';
}

interface AppContextType extends AppState {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'priorityScore' | 'postponedCount' | 'isFixedTime' | 'isWorship' | 'actualMinutes' | 'isRunning' | 'lastStartTime'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  undoDeleteTask: () => void;
  toggleTask: (id: string) => void;
  toggleTaskTimer: (id: string) => void;
  clearCompletedTasks: () => void;
  organizeMyDay: () => Promise<void>;
  autoBalance: (tasksToPostpone: Task[]) => void;
  overloadInfo: OverloadInfo;
  setDailyAvailableMinutes: (minutes: number) => void;
  toggleSurvivalMode: () => void;
  toggleBadDayMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  addHabit: (habit: { name: string; description: string }) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string) => void;
  clearAllHabits: () => void;
  setGoals: (goals: string[]) => void;
  login: (name: string) => void;
  logout: () => void;
  clearAllData: () => void;
  completeOnboarding: () => void;
  setLanguage: (lang: Language) => void;
  setWeekMode: (mode: WeekMode) => void;
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
  progress: number;
  lastDeletedTask: Task | null;
  isHydrated: boolean;
  milestone: string | null;
  realityCheck: RealityCheckResult | null;
  victoryDayPending: boolean;
  clearRealityCheck: () => void;
  clearMilestone: () => void;
  saveSuccessLog: (secretSauce: string) => void;
  dismissVictory: () => void;
  setDailyIntention: (text: string) => void;
  joinChallenge: (id: string) => void; 
  addIdea: (text: string) => void;
  deleteIdea: (id: string) => void;
  convertIdeaToTask: (id: string, useAI?: boolean) => Promise<void>;
}

const STORAGE_KEY = 'focusflow_v12_rhythm';
const LANG_KEY = 'lang_code';

const calculatePriorityScore = (task: Partial<Task>): number => {
  let score = 0;
  const now = new Date();
  const deadline = task.deadline ? new Date(task.deadline) : new Date();
  const isOverdueOrToday = deadline.toDateString() === now.toDateString() || deadline < now;
  const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === deadline.toDateString();

  if (isOverdueOrToday) score += 50;
  else if (isTomorrow) score += 30;

  switch (task.category) {
    case Category.PRAYER: score += 20; break;
    case Category.STUDY: score += 15; break;
    case Category.WORK: score += 10; break;
    case Category.HABIT: score += 5; break;
  }
  score += (task.postponedCount || 0) * 5;
  if (task.estimatedMinutes && task.estimatedMinutes < 30) score += 5;
  return score;
};

const PRAYERS_CONFIG = [
  { name: 'Fajr', time: '05:00 AM', hour: 5.0 },
  { name: 'Dhuhr', time: '12:15 PM', hour: 12.25 },
  { name: 'Asr', time: '03:45 PM', hour: 15.75 },
  { name: 'Maghrib', time: '06:10 PM', hour: 18.16 },
  { name: 'Isha', time: '07:45 PM', hour: 19.75 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [milestone, setMilestone] = useState<string | null>(null);
  const [realityCheck, setRealityCheck] = useState<RealityCheckResult | null>(null);
  const [victoryDayPending, setVictoryDayPending] = useState(false);

  const getInitialState = (): AppState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedLang = localStorage.getItem(LANG_KEY) as Language | null;
    const todayStr = new Date().toDateString();
    
    const fallback: AppState = {
      tasks: [],
      habits: INITIAL_HABITS.map(h => ({ ...h, history: h.history || [] })),
      challenges: DEFAULT_CHALLENGES,
      ideas: [],
      successLogs: [],
      userName: '',
      selectedGoals: [],
      isLoggedIn: false,
      hasSeenOnboarding: false,
      notificationsEnabled: true,
      isDarkMode: false,
      language: savedLang || 'ar',
      dailyAvailableMinutes: 480,
      isSurvivalMode: false,
      isBadDayMode: false,
      dailyIntention: '',
      intentionDate: todayStr,
      categoryBias: {
        [Category.STUDY]: 1.0,
        [Category.WORK]: 1.0,
        [Category.HABIT]: 1.0,
        [Category.PRAYER]: 1.0,
        [Category.OTHER]: 1.0,
      },
      currentWeekMode: WeekMode.STANDARD,
      weekStartDate: undefined
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        return { 
          ...fallback, 
          ...parsed, 
          tasks: parsed.tasks || [],
          habits: parsed.habits || [],
          ideas: parsed.ideas || [],
          language: savedLang || parsed.language || 'ar' 
        };
      } catch (e) { console.error("Initial load failed", e); }
    }
    return fallback;
  };

  const [state, setState] = useState<AppState>(getInitialState);

  const setWeekMode = (mode: WeekMode) => {
    setState(prev => ({
      ...prev,
      currentWeekMode: mode,
      weekStartDate: new Date().toISOString()
    }));
  };

  useEffect(() => { setIsHydrated(true); }, []);
  
  useEffect(() => {
    if (isHydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, isHydrated]);

  const toggleTaskTimer = useCallback((id: string) => {
    setState(prev => {
      const now = new Date();
      return {
        ...prev,
        tasks: prev.tasks.map(t => {
          // Rule: Mutual exclusion - stop other running timers
          if (t.id !== id && t.isRunning) {
            const elapsed = Math.round((now.getTime() - new Date(t.lastStartTime!).getTime()) / 60000);
            return { ...t, isRunning: false, actualMinutes: t.actualMinutes + elapsed, lastStartTime: undefined };
          }
          if (t.id === id) {
            if (t.isRunning) {
              const elapsed = Math.round((now.getTime() - new Date(t.lastStartTime!).getTime()) / 60000);
              return { ...t, isRunning: false, actualMinutes: t.actualMinutes + elapsed, lastStartTime: undefined };
            } else {
              return { ...t, isRunning: true, lastStartTime: now.toISOString() };
            }
          }
          return t;
        })
      };
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState(prev => {
      const now = new Date();
      const task = prev.tasks.find(t => t.id === id);
      if (!task) return prev;
      const isFinishing = !task.isCompleted;
      let finalActual = task.actualMinutes;
      // Rule: Auto-stop timer on completion
      if (isFinishing && task.isRunning) {
        const elapsed = Math.round((now.getTime() - new Date(task.lastStartTime!).getTime()) / 60000);
        finalActual += elapsed;
      }
      return { 
        ...prev, 
        tasks: prev.tasks.map(t => id === t.id ? { ...t, isCompleted: !t.isCompleted, isRunning: false, actualMinutes: finalActual, lastStartTime: undefined } : t) 
      };
    });
  }, []);

  const addTask = useCallback((taskData: any) => {
    const newTask: Task = { 
      ...taskData, 
      id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(), 
      priorityScore: calculatePriorityScore(taskData), 
      postponedCount: 0, 
      actualMinutes: 0, 
      isRunning: false, 
      isFixedTime: false, 
      isWorship: false 
    };
    setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (task) setLastDeletedTask(task);
      return { ...prev, tasks: prev.tasks.filter(t => t.id !== id) };
    });
  }, []);

  const t = (key: string): string => ((TRANSLATIONS as any)[state.language] || TRANSLATIONS.en)[key] || key;
  const progress = state.tasks?.length > 0 ? (state.tasks.filter(t => t.isCompleted).length / state.tasks.length) * 100 : 0;

  return (
    <AppContext.Provider value={{ 
      ...state, 
      addTask, 
      updateTask: (task) => setState(p => ({ ...p, tasks: p.tasks.map(t => t.id === task.id ? task : t) })),
      deleteTask,
      undoDeleteTask: () => { if (lastDeletedTask) setState(p => ({ ...p, tasks: [lastDeletedTask, ...p.tasks] })); setLastDeletedTask(null); },
      toggleTask, 
      toggleTaskTimer, 
      clearCompletedTasks: () => setState(p => ({ ...p, tasks: p.tasks.filter(t => !t.isCompleted) })),
      organizeMyDay: async () => {}, 
      autoBalance: () => {}, 
      overloadInfo: { isOverloaded: false, excessMinutes: 0, suggestedToPostpone: [], totalTaskMinutes: 0 },
      setDailyAvailableMinutes: (m) => setState(p => ({ ...p, dailyAvailableMinutes: m })), 
      toggleSurvivalMode: () => setState(p => ({ ...p, isSurvivalMode: !p.isSurvivalMode })),
      toggleBadDayMode: (v) => setState(p => ({ ...p, isBadDayMode: v })),
      toggleDarkMode: () => setState(p => ({ ...p, isDarkMode: !p.isDarkMode })),
      setNotificationsEnabled: (v) => setState(p => ({ ...p, notificationsEnabled: v })),
      addHabit: (h) => setState(p => ({ ...p, habits: [{ id: Math.random().toString(36).substr(2,9), ...h, streakCount: 0, isCompletedToday: false, createdAt: new Date().toISOString(), history: [] }, ...p.habits] })),
      updateHabit: (h) => setState(p => ({ ...p, habits: p.habits.map(x => x.id === h.id ? h : x) })), 
      deleteHabit: (id) => setState(p => ({ ...p, habits: p.habits.filter(x => x.id !== id) })),
      toggleHabit: (id) => setState(p => ({ ...p, habits: p.habits.map(h => h.id === id ? { ...h, isCompletedToday: !h.isCompletedToday } : h) })),
      clearAllHabits: () => setState(p => ({ ...p, habits: [] })),
      setGoals: (g) => setState(prev => ({ ...prev, selectedGoals: g })), 
      login: (name) => setState(p => ({ ...p, userName: name, isLoggedIn: true })), 
      logout: () => { localStorage.clear(); window.location.reload(); }, 
      clearAllData: () => { localStorage.clear(); window.location.reload(); },
      completeOnboarding: () => setState(prev => ({ ...prev, hasSeenOnboarding: true })), 
      setLanguage: (lang) => setState(prev => ({ ...prev, language: lang })), 
      setWeekMode, 
      t, 
      progress, 
      lastDeletedTask, 
      isHydrated, 
      milestone: null, 
      clearMilestone: () => {},
      realityCheck: null, 
      clearRealityCheck: () => {}, 
      victoryDayPending: false, 
      saveSuccessLog: () => {}, 
      dismissVictory: () => {}, 
      setDailyIntention: (i) => setState(p => ({ ...p, dailyIntention: i })), 
      joinChallenge: () => {}, 
      addIdea: () => {}, 
      deleteIdea: () => {}, 
      convertIdeaToTask: async () => {}
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
