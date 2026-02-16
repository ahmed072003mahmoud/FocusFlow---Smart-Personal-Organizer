
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { Task, AppState, Priority, BehaviorEvent, WeekMode, Badge, Habit, Idea, BehaviorType, Category, PlanningMood, AppLanguage } from './types';
import { INITIAL_HABITS, DEFAULT_CHALLENGES, TRANSLATIONS } from './constants';
import { INITIAL_BADGES, GamificationEngine } from './utils/GamificationEngine';
import { BehaviorEngine } from './utils/BehaviorEngine';
import { AIOrchestrationLayer } from './utils/AIOrchestrationLayer';
import { SmartTaskParser } from './utils/SmartTaskParser';

type Action = 
  | { type: 'SET_STATE'; payload: Partial<AppState> }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_ZEN'; payload: string | null }
  | { type: 'LOG_BEHAVIOR'; payload: BehaviorEvent }
  | { type: 'LOGIN'; payload: { userName: string; email: string; isGuest: boolean } }
  | { type: 'TOGGLE_HABIT'; payload: string }
  | { type: 'ADD_IDEA'; payload: Idea }
  | { type: 'DELETE_IDEA'; payload: string }
  | { type: 'SET_LANGUAGE'; payload: AppLanguage };

const STORAGE_KEY = 'focus_flow_v12_final';

interface AppContextType extends AppState {
  dispatch: React.Dispatch<Action>;
  setState: (state: Partial<AppState>) => void;
  addTask: (t: any) => void;
  updateTask: (t: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  deferTask: (id: string) => void;
  toggleZenMode: (id: string | null) => void;
  logBehavior: (type: BehaviorType, metadata?: any) => void;
  login: (userName: string, email: string) => void;
  guestLogin: () => void;
  completeOnboarding: () => void;
  toggleHabit: (id: string) => void;
  addIdea: (text: string) => void;
  deleteIdea: (id: string) => void;
  // Added missing method to interface
  convertIdeaToTask: (id: string, mode: 'local' | 'flash' | 'pro') => Promise<void>;
  updateMood: (mood: PlanningMood) => void;
  setWeekMode: (mode: WeekMode) => void;
  setLanguage: (lang: AppLanguage) => void;
  toggleDarkMode: () => void;
  isFeatureUnlocked: (featureId: string) => boolean;
  load: number;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE': return { ...state, ...action.payload };
    case 'LOGIN': return { ...state, isLoggedIn: true, userName: action.payload.userName, email: action.payload.email, isGuest: action.payload.isGuest };
    case 'ADD_TASK': return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK': return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TASK': return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'TOGGLE_ZEN': return { ...state, isZenModeActive: !!action.payload, zenTaskId: action.payload };
    case 'LOG_BEHAVIOR': return { ...state, behaviorHistory: [...state.behaviorHistory, action.payload] };
    case 'TOGGLE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h => h.id === action.payload ? { ...h, isCompletedToday: !h.isCompletedToday, streakCount: !h.isCompletedToday ? h.streakCount + 1 : Math.max(0, h.streakCount - 1) } : h)
      };
    case 'ADD_IDEA': return { ...state, ideas: [action.payload, ...state.ideas] };
    case 'DELETE_IDEA': return { ...state, ideas: state.ideas.filter(i => i.id !== action.payload) };
    case 'SET_LANGUAGE': return { ...state, language: action.payload };
    default: return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null, () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const fallback: AppState = {
      tasks: [], habits: INITIAL_HABITS, challenges: DEFAULT_CHALLENGES, successLogs: [], ideas: [],
      isLoggedIn: false, hasSeenOnboarding: false, isDarkMode: true, language: 'ar',
      userName: 'طالب ذكي', email: '', isGuest: false, behaviorHistory: [], badges: INITIAL_BADGES,
      isZenModeActive: false, zenTaskId: null, currentWeekMode: WeekMode.STANDARD,
      isComplexityKillSwitchActive: false,
      persona: {
        isMorningPerson: true, avgCompletionTime: '00:00', currentMood: 'Focused',
        dailyIntention: '', energyLevel: 100, isOverloaded: false, consistencyScore: 0,
        energyProfile: 'mixed', completionStyle: 'sprinter', overwhelmTrigger: 5, deepWorkHours: 0
      }
    };
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  });

  // Sync Direction and Theme
  useEffect(() => {
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // AI Strategic Loop
  useEffect(() => {
    const checkStrategicCue = async () => {
      const decision = await AIOrchestrationLayer.evaluateSituation({
        tasks: state.tasks,
        history: state.behaviorHistory,
        persona: state.persona,
        load: BehaviorEngine.calculatePsychologicalLoad(state.tasks)
      });
      if (decision && decision.type !== state.lastStrategicCue) {
        dispatch({ type: 'SET_STATE', payload: { lastStrategicCue: decision.type as any } });
      }
    };
    const timer = setTimeout(checkStrategicCue, 5000);
    return () => clearTimeout(timer);
  }, [state.tasks, state.behaviorHistory]);

  const setState = (payload: Partial<AppState>) => dispatch({ type: 'SET_STATE', payload });
  const logBehavior = (type: BehaviorType, metadata?: any) => dispatch({ type: 'LOG_BEHAVIOR', payload: { type, timestamp: new Date().toISOString(), metadata } });
  
  const addTask = (t: any) => dispatch({ 
    type: 'ADD_TASK', 
    payload: { 
      ...t, 
      id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(), 
      postponedCount: 0, 
      isCompleted: false, 
      priorityScore: t.priority === Priority.HIGH ? 80 : 40 
    } 
  });
  
  const updateTask = (t: Task) => dispatch({ type: 'UPDATE_TASK', payload: t });
  const deleteTask = (id: string) => dispatch({ type: 'DELETE_TASK', payload: id });
  
  const toggleTask = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, isCompleted: !task.isCompleted } });
      if (!task.isCompleted) logBehavior('task_complete', { taskId: id });
    }
  };
  
  const deferTask = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, postponedCount: task.postponedCount + 1 } });
      logBehavior('task_postpone', { taskId: id });
    }
  };

  const login = (userName: string, email: string) => dispatch({ type: 'LOGIN', payload: { userName, email, isGuest: false } });
  const guestLogin = () => dispatch({ type: 'LOGIN', payload: { userName: 'Guest Explorer', email: 'guest@local', isGuest: true } });
  const completeOnboarding = () => dispatch({ type: 'SET_STATE', payload: { hasSeenOnboarding: true } });
  const toggleHabit = (id: string) => dispatch({ type: 'TOGGLE_HABIT', payload: id });
  const addIdea = (text: string) => dispatch({ type: 'ADD_IDEA', payload: { id: Math.random().toString(36).substr(2, 9), text, capturedAt: new Date().toISOString() } });
  const deleteIdea = (id: string) => dispatch({ type: 'DELETE_IDEA', payload: id });

  // Added missing implementation for convertIdeaToTask
  const convertIdeaToTask = async (id: string, mode: 'local' | 'flash' | 'pro') => {
    const idea = state.ideas.find(i => i.id === id);
    if (!idea) return;

    let parsed: Partial<Task>;
    if (mode === 'local') {
      parsed = SmartTaskParser.parse(idea.text);
    } else if (mode === 'flash') {
      const result = await AIOrchestrationLayer.fastTaskAnalysis(idea.text);
      parsed = SmartTaskParser.parse(result || idea.text);
    } else {
      // Pro mode
      const result = await AIOrchestrationLayer.deepThinkStrategicPivot(idea.text);
      parsed = SmartTaskParser.parse(result || idea.text);
    }

    addTask(parsed);
    deleteIdea(id);
    logBehavior('use_ai', { mode, ideaId: id });
  };

  const updateMood = (mood: PlanningMood) => dispatch({ type: 'SET_STATE', payload: { persona: { ...state.persona, currentMood: mood } } });
  const setWeekMode = (mode: WeekMode) => dispatch({ type: 'SET_STATE', payload: { currentWeekMode: mode } });
  const setLanguage = (lang: AppLanguage) => dispatch({ type: 'SET_LANGUAGE', payload: lang });
  const toggleDarkMode = () => dispatch({ type: 'SET_STATE', payload: { isDarkMode: !state.isDarkMode } });

  const isFeatureUnlocked = (featureId: string) => {
    const totalCompletions = state.tasks.filter(t => t.isCompleted).length;
    if (featureId === 'ai_lab') return totalCompletions >= 1;
    if (featureId === 'dna_stats') return totalCompletions >= 2;
    return true;
  };

  const load = useMemo(() => BehaviorEngine.calculatePsychologicalLoad(state.tasks), [state.tasks]);
  const t = useCallback((key: string): string => {
    const dict = (TRANSLATIONS as any)[state.language] || TRANSLATIONS.en;
    return dict[key] || key;
  }, [state.language]);

  return (
    <AppContext.Provider value={{ 
      ...state, dispatch, setState, addTask, updateTask, toggleTask, deleteTask, deferTask,
      logBehavior, login, guestLogin, completeOnboarding, toggleHabit, addIdea, deleteIdea,
      convertIdeaToTask, updateMood, setWeekMode, setLanguage, toggleDarkMode, isFeatureUnlocked,
      toggleZenMode: (id) => {
        dispatch({ type: 'TOGGLE_ZEN', payload: id });
        if (id) logBehavior('zen_mode_enter', { taskId: id });
      },
      load, t
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
