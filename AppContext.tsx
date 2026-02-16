
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Task, Habit, AppState, UserPersona, Category, Priority, PlanningMood, BehaviorEvent, WeekMode, Badge } from './types';
import { GoogleGenAI } from "@google/genai";
import { BehaviorEngine } from './utils/BehaviorEngine';
import { TRANSLATIONS, INITIAL_HABITS, DEFAULT_CHALLENGES } from './constants';
import { INITIAL_BADGES, GamificationEngine } from './utils/GamificationEngine';

interface AppContextType extends AppState {
  login: (name: string, email: string) => void;
  signUp: (name: string, email: string) => void;
  guestLogin: () => void;
  completeOnboarding: () => void;
  addTask: (task: Omit<Task, 'id' | 'postponedCount' | 'createdAt' | 'priorityScore'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  undoDeleteTask: () => void;
  clearCompletedTasks: () => void;
  toggleTask: (id: string) => void;
  toggleTaskTimer: (id: string) => void;
  deferTask: (id: string) => void;
  updateMood: (mood: PlanningMood) => void;
  setIntention: (text: string) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  processBrainDump: (text: string) => Promise<void>;
  organizeMyDay: () => Promise<void>;
  clearAllData: () => void;
  toggleBadDayMode: (val: boolean) => void;
  setWeekMode: (mode: WeekMode) => void;
  autoBalance: () => void;
  clearMilestone: () => void;
  dismissVictory: () => void;
  joinChallenge: (id: string) => void;
  toggleHabit: (id: string) => void;
  addHabit: (habit: { name: string; description: string }) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  setDailyIntention: (val: string) => void;
  convertIdeaToTask: (id: string, mode: 'local' | 'flash' | 'pro') => Promise<void>;
  addIdea: (text: string) => void;
  deleteIdea: (id: string) => void;
  logBehavior: (type: any, metadata?: any) => void;
  t: (key: string) => string;
  suggestion: string | null;
  load: number;
  overloadInfo: any;
  activeSoftPrompt: any;
  milestone: string | null;
  isSurvivalMode: boolean;
  isBadDayMode: boolean;
  dailyAvailableMinutes: number;
  victoryDayPending: boolean;
  dailyIntention: string;
  currentWeekMode: WeekMode;
  weekStartDate: string;
  ideas: any[];
  challenges: any[];
  successLogs: any[];
  toggleZenMode: (taskId?: string) => void;
  toggleFlowState: () => void;
  setAmbientSound: (sound: 'none' | 'rain' | 'cafe' | 'white') => void;
  generateEncouragement: () => Promise<string>;
  taskDetox: () => void;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const STORAGE_KEY = 'focus_flow_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const fallback: AppState = {
      tasks: [],
      habits: INITIAL_HABITS,
      isLoggedIn: false,
      hasSeenOnboarding: false,
      isGuest: false,
      isDarkMode: false,
      userName: '',
      email: '',
      persona: {
        isMorningPerson: true,
        avgCompletionTime: '00:00',
        currentMood: 'Focused',
        dailyIntention: '',
        energyLevel: 100,
        isOverloaded: false,
        consistencyScore: 0,
        energyProfile: 'mixed',
        completionStyle: 'sprinter',
        overwhelmTrigger: 5,
        deepWorkHours: 0
      },
      behaviorHistory: [],
      badges: INITIAL_BADGES,
      aiUsageCount: 0,
      isFlowStateActive: false,
      isZenModeActive: false,
      zenTaskId: null,
      ambientSound: 'none'
    };
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...fallback, ...parsed };
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  });

  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [milestone, setMilestone] = useState<string | null>(null);
  const dailyAvailableMinutes = 480; 

  const load = useMemo(() => BehaviorEngine.calculatePsychologicalLoad(state.tasks), [state.tasks]);
  const isSurvivalMode = useMemo(() => load > 100, [load]);
  const suggestion = useMemo(() => BehaviorEngine.analyze(state.behaviorHistory, state.tasks), [state.behaviorHistory, state.tasks]);

  const t = useCallback((key: string): string => {
    const lang = (state as any).language || 'en';
    const dict = (TRANSLATIONS as any)[lang] || TRANSLATIONS.en;
    return dict[key] || key;
  }, [state]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // AI Encouragement Logic
  const generateEncouragement = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const completed = state.tasks.filter(t => t.isCompleted).map(t => t.title).join(', ');
    const prompt = `Based on these completed student tasks: [${completed}], write a human-like, 2-line encouraging weekly summary. Be authentic, not robotic.`;
    try {
      const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      return res.text || "Keep growing!";
    } catch { return "Continuous effort leads to mastery."; }
  };

  const logBehavior = useCallback((type: any, metadata?: any) => {
    setState(s => {
      const { updatedBadges, newUnlock } = GamificationEngine.checkBadgeUpdates(s, type as any);
      if (newUnlock) setMilestone(`Badge Unlocked: ${newUnlock.title}! 🏆`);
      return {
        ...s,
        behaviorHistory: [...s.behaviorHistory, { type, timestamp: new Date().toISOString(), metadata }],
        badges: updatedBadges,
        aiUsageCount: type === 'use_ai' ? s.aiUsageCount + 1 : s.aiUsageCount
      };
    });
  }, []);

  const toggleZenMode = (taskId?: string) => {
    setState(s => ({
      ...s,
      isZenModeActive: !s.isZenModeActive,
      zenTaskId: taskId || null,
      ambientSound: (!s.isZenModeActive && taskId) ? 'rain' : s.ambientSound
    }));
    logBehavior('zen_mode_enter', { taskId });
  };

  const toggleFlowState = () => {
    setState(s => ({ ...s, isFlowStateActive: !s.isFlowStateActive }));
    logBehavior('flow_state_toggle');
  };

  const setAmbientSound = (sound: any) => setState(s => ({ ...s, ambientSound: sound }));

  const taskDetox = () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    setState(s => ({
      ...s,
      tasks: s.tasks.filter(t => new Date(t.createdAt) > cutoff || !t.isCompleted)
    }));
    setMilestone("Mindful Detox Complete! ✨");
  };

  // Rest of the methods...
  const addTask = (tData: any) => setState(s => ({ ...s, tasks: [{ ...tData, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), postponedCount: 0, priorityScore: tData.priority === Priority.HIGH ? 100 : 50 }, ...s.tasks] }));
  const toggleTask = (id: string) => {
    setState(s => {
      const updatedTasks = s.tasks.map(t => {
        if (t.id === id) {
          const completed = !t.isCompleted;
          if (completed && t.timerStartedAt) {
            const start = new Date(t.timerStartedAt).getTime();
            const now = new Date().getTime();
            const mins = (now - start) / 60000;
            if (mins >= 30) {
              s.persona.deepWorkHours += (mins / 60);
            }
          }
          return { ...t, isCompleted: completed, isRunning: false };
        }
        return t;
      });
      return { ...s, tasks: updatedTasks };
    });
    logBehavior('task_complete', { id });
  };
  const toggleTaskTimer = (id: string) => setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, isRunning: !t.isRunning, timerStartedAt: !t.isRunning ? new Date().toISOString() : t.timerStartedAt } : { ...t, isRunning: false }) }));

  const contextValue: AppContextType = {
    ...state,
    login: (name: string, email: string) => setState(s => ({ ...s, isLoggedIn: true, userName: name, email })),
    signUp: (name: string, email: string) => setState(s => ({ ...s, isLoggedIn: true, userName: name, email })),
    guestLogin: () => setState(s => ({ ...s, isLoggedIn: true, isGuest: true, userName: 'Guest' })),
    completeOnboarding: () => setState(s => ({ ...s, hasSeenOnboarding: true })),
    addTask,
    updateTask: (t: Task) => setState(s => ({ ...s, tasks: s.tasks.map(prev => prev.id === t.id ? t : prev) })),
    deleteTask: (id: string) => setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) })),
    undoDeleteTask: () => { if (lastDeletedTask) setState(s => ({ ...s, tasks: [lastDeletedTask, ...s.tasks] })) },
    clearCompletedTasks: () => setState(s => ({ ...s, tasks: s.tasks.filter(t => !t.isCompleted) })),
    toggleTask,
    toggleTaskTimer,
    deferTask: (id: string) => { setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, postponedCount: t.postponedCount + 1 } : t) })); logBehavior('task_postpone', { id }); },
    updateMood: (mood: PlanningMood) => setState(s => ({ ...s, persona: { ...s.persona, currentMood: mood } })),
    setIntention: (dailyIntention: string) => setState(s => ({ ...s, persona: { ...s.persona, dailyIntention } })),
    toggleDarkMode: () => setState(s => ({ ...s, isDarkMode: !s.isDarkMode })),
    setLanguage: (lang: any) => setState(s => ({ ...s, language: lang } as any)),
    setNotificationsEnabled: (enabled: boolean) => setState(s => ({ ...s, notificationsEnabled: enabled } as any)),
    processBrainDump: async (text: string) => { /* logic */ },
    organizeMyDay: async () => { /* logic */ },
    clearAllData: () => { localStorage.removeItem(STORAGE_KEY); window.location.reload(); },
    toggleBadDayMode: (val: boolean) => setState(s => ({ ...s, isBadDayMode: val } as any)),
    setWeekMode: (mode: WeekMode) => setState(s => ({ ...s, currentWeekMode: mode, weekStartDate: new Date().toISOString() } as any)),
    autoBalance: () => { /* logic */ },
    clearMilestone: () => setMilestone(null),
    dismissVictory: () => setState(s => ({ ...s, victoryDayPending: false } as any)),
    joinChallenge: (id: string) => { /* logic */ },
    toggleHabit: (id: string) => { /* logic */ },
    addHabit: (h: any) => { /* logic */ },
    updateHabit: (h: any) => { /* logic */ },
    deleteHabit: (id: string) => { /* logic */ },
    setDailyIntention: (val: string) => setState(s => ({ ...s, persona: { ...s.persona, dailyIntention: val } })),
    convertIdeaToTask: async (id: any, mode: any) => { /* logic */ },
    addIdea: (text: string) => { /* logic */ },
    deleteIdea: (id: string) => { /* logic */ },
    logBehavior,
    t,
    suggestion,
    load,
    overloadInfo: { isOverloaded: load > 100, loadPercent: load },
    activeSoftPrompt: (state as any).activeSoftPrompt || null,
    milestone,
    isSurvivalMode,
    isBadDayMode: (state as any).isBadDayMode || false,
    dailyAvailableMinutes,
    victoryDayPending: (state as any).victoryDayPending || false,
    dailyIntention: state.persona.dailyIntention,
    currentWeekMode: (state as any).currentWeekMode || WeekMode.STANDARD,
    weekStartDate: (state as any).weekStartDate || new Date().toISOString(),
    ideas: (state as any).ideas || [],
    challenges: (state as any).challenges || DEFAULT_CHALLENGES,
    successLogs: (state as any).successLogs || [],
    toggleZenMode,
    toggleFlowState,
    setAmbientSound,
    generateEncouragement,
    taskDetox,
    setState
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
