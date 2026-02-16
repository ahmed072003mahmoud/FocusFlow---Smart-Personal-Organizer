
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { Task, AppState, UserPersona, Category, Priority, PlanningMood, BehaviorEvent, WeekMode, Badge, Habit, Challenge, SuccessLog, Idea, BehaviorType } from './types';
import { GoogleGenAI } from "@google/genai";
import { TRANSLATIONS, INITIAL_HABITS, DEFAULT_CHALLENGES } from './constants';
import { INITIAL_BADGES, GamificationEngine, ActionType } from './utils/GamificationEngine';
import { BehaviorEngine } from './utils/BehaviorEngine';
import { SmartTaskParser } from './utils/SmartTaskParser';

type Action = 
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_ZEN'; payload: string | null }
  | { type: 'TOGGLE_FLOW' }
  | { type: 'SET_MOOD'; payload: PlanningMood }
  | { type: 'SET_SOUND'; payload: AppState['ambientSound'] }
  | { type: 'LOG_BEHAVIOR'; payload: BehaviorEvent }
  | { type: 'DETOX_TASKS' }
  | { type: 'LOGIN'; payload: { userName: string; email: string; isGuest: boolean } }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'TOGGLE_HABIT'; payload: string }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'ADD_IDEA'; payload: Idea }
  | { type: 'DELETE_IDEA'; payload: string }
  | { type: 'SET_WEEK_MODE'; payload: WeekMode }
  | { type: 'SET_STATE'; payload: Partial<AppState> };

const STORAGE_KEY = 'focus_flow_v6_shadow';

interface AppContextType extends AppState {
  dispatch: React.Dispatch<Action>;
  setState: (state: Partial<AppState>) => void;
  addTask: (t: any) => void;
  updateTask: (t: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  deferTask: (id: string) => void;
  logBehavior: (type: BehaviorType, metadata?: any) => void;
  generateWeeklySummary: () => Promise<string>;
  toggleZenMode: (id: string | null) => void;
  t: (key: string) => string;
  load: number;
  login: (userName: string, email: string) => void;
  guestLogin: () => void;
  completeOnboarding: () => void;
  toggleDarkMode: () => void;
  setWeekMode: (mode: WeekMode) => void;
  addHabit: (h: Partial<Habit>) => void;
  toggleHabit: (id: string) => void;
  updateHabit: (h: Habit) => void;
  deleteHabit: (id: string) => void;
  addIdea: (text: string) => void;
  deleteIdea: (id: string) => void;
  convertIdeaToTask: (id: string, mode: 'local' | 'flash' | 'pro') => Promise<void>;
  processBrainDump: (text: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  let newState = state;

  switch (action.type) {
    case 'SET_STATE':
      newState = { ...state, ...action.payload };
      break;
    case 'LOGIN':
      newState = { ...state, isLoggedIn: true, userName: action.payload.userName, email: action.payload.email, isGuest: action.payload.isGuest };
      break;
    case 'COMPLETE_ONBOARDING':
      newState = { ...state, hasSeenOnboarding: true };
      break;
    case 'TOGGLE_DARK_MODE':
      newState = { ...state, isDarkMode: !state.isDarkMode };
      break;
    case 'ADD_TASK':
      newState = { ...state, tasks: [action.payload, ...state.tasks] };
      break;
    case 'UPDATE_TASK':
      newState = { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
      break;
    case 'DELETE_TASK':
      newState = { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
      break;
    case 'TOGGLE_ZEN':
      newState = { ...state, isZenModeActive: !!action.payload, zenTaskId: action.payload };
      break;
    case 'TOGGLE_FLOW':
      newState = { ...state, isFlowStateActive: !state.isFlowStateActive };
      break;
    case 'SET_MOOD':
      newState = { ...state, persona: { ...state.persona, currentMood: action.payload } };
      break;
    case 'SET_SOUND':
      newState = { ...state, ambientSound: action.payload };
      break;
    case 'SET_WEEK_MODE':
      newState = { ...state, currentWeekMode: action.payload };
      break;
    case 'ADD_HABIT':
      newState = { ...state, habits: [action.payload, ...state.habits] };
      break;
    case 'TOGGLE_HABIT':
      newState = {
        ...state,
        habits: state.habits.map(h => {
          if (h.id === action.payload) {
            const completed = !h.isCompletedToday;
            return {
              ...h,
              isCompletedToday: completed,
              streakCount: completed ? h.streakCount + 1 : Math.max(0, h.streakCount - 1),
              lastCompletedDate: completed ? new Date().toISOString() : h.lastCompletedDate
            };
          }
          return h;
        })
      };
      break;
    case 'UPDATE_HABIT':
      newState = { ...state, habits: state.habits.map(h => h.id === action.payload.id ? action.payload : h) };
      break;
    case 'DELETE_HABIT':
      newState = { ...state, habits: state.habits.filter(h => h.id !== action.payload) };
      break;
    case 'ADD_IDEA':
      newState = { ...state, ideas: [action.payload, ...state.ideas] };
      break;
    case 'DELETE_IDEA':
      newState = { ...state, ideas: state.ideas.filter(i => i.id !== action.payload) };
      break;
    case 'LOG_BEHAVIOR':
      newState = { ...state, behaviorHistory: [...state.behaviorHistory, action.payload] };
      break;
    case 'DETOX_TASKS':
      newState = { ...state, tasks: state.tasks.filter(t => !t.isCompleted) };
      break;
    default:
      return state;
  }
  return newState;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null, () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const fallback: AppState = {
      tasks: [],
      habits: INITIAL_HABITS,
      challenges: DEFAULT_CHALLENGES,
      successLogs: [],
      ideas: [],
      isLoggedIn: false,
      hasSeenOnboarding: false,
      isGuest: false,
      isDarkMode: false,
      userName: 'طالب ذكي',
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
      ambientSound: 'none',
      currentWeekMode: WeekMode.STANDARD,
      isSurvivalMode: false,
      activeSoftPrompt: null
    };
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setState = (payload: Partial<AppState>) => dispatch({ type: 'SET_STATE', payload });
  const login = (userName: string, email: string) => dispatch({ type: 'LOGIN', payload: { userName, email, isGuest: false } });
  const guestLogin = () => dispatch({ type: 'LOGIN', payload: { userName: 'Guest', email: 'guest@focusflow.ai', isGuest: true } });
  const completeOnboarding = () => dispatch({ type: 'COMPLETE_ONBOARDING' });
  const toggleDarkMode = () => dispatch({ type: 'TOGGLE_DARK_MODE' });
  const setWeekMode = (mode: WeekMode) => dispatch({ type: 'SET_WEEK_MODE', payload: mode });

  const addTask = (t: any) => dispatch({ type: 'ADD_TASK', payload: { ...t, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), postponedCount: 0, priorityScore: t.priority === Priority.HIGH ? 100 : 50, isCompleted: false } });
  const updateTask = (t: Task) => dispatch({ type: 'UPDATE_TASK', payload: t });
  const deleteTask = (id: string) => dispatch({ type: 'DELETE_TASK', payload: id });
  const deferTask = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, postponedCount: task.postponedCount + 1 } });
      logBehavior('task_postpone', { id });
    }
  };

  const addHabit = (h: Partial<Habit>) => dispatch({ type: 'ADD_HABIT', payload: { ...h, id: Math.random().toString(36).substr(2, 9), streakCount: 0, isCompletedToday: false, lastCompletedDate: '', createdAt: new Date().toISOString(), history: {} } as Habit });
  const toggleHabit = (id: string) => dispatch({ type: 'TOGGLE_HABIT', payload: id });
  const updateHabit = (h: Habit) => dispatch({ type: 'UPDATE_HABIT', payload: h });
  const deleteHabit = (id: string) => dispatch({ type: 'DELETE_HABIT', payload: id });

  const addIdea = (text: string) => dispatch({ type: 'ADD_IDEA', payload: { id: Math.random().toString(36).substr(2, 9), text, capturedAt: new Date().toISOString() } });
  const deleteIdea = (id: string) => dispatch({ type: 'DELETE_IDEA', payload: id });

  const toggleTask = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const updated = { ...task, isCompleted: !task.isCompleted };
      dispatch({ type: 'UPDATE_TASK', payload: updated });
      logBehavior('task_complete', { id });
    }
  };

  const logBehavior = (type: BehaviorType, metadata?: any) => {
    const event = { type, timestamp: new Date().toISOString(), metadata };
    dispatch({ type: 'LOG_BEHAVIOR', payload: event });
  };

  const convertIdeaToTask = async (id: string, mode: 'local' | 'flash' | 'pro') => {
    const idea = state.ideas.find(i => i.id === id);
    if (!idea) return;

    if (mode === 'local') {
      const parsed = SmartTaskParser.parse(idea.text);
      addTask(parsed);
      deleteIdea(id);
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = mode === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const config = mode === 'pro' ? { thinkingConfig: { thinkingBudget: 32768 } } : {};
    
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Analyze this thought and convert it into a concrete task structure: "${idea.text}". Return a JSON object with: title, category (Study, Habit, Prayer, Work, Other), priority (High, Normal), estimatedMinutes (int), time (HH:MM AM/PM).`,
        config: config
      });
      
      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        addTask({ ...data, isCompleted: false, deadline: new Date().toISOString() });
        deleteIdea(id);
      }
    } catch (e) {
      console.error("AI Conversion failed", e);
      throw e;
    }
  };

  const processBrainDump = async (text: string) => {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    for (const line of lines) {
      const parsed = SmartTaskParser.parse(line);
      addTask(parsed);
    }
  };

  const generateWeeklySummary = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const completed = state.tasks.filter(t => t.isCompleted).map(t => t.title).join(', ');
    const prompt = `Student stats: ${completed}. Write a 2-line strategic summary for their week. Don't be robotic, be a high-performance mentor.`;
    try {
      const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      return res.text || "أداء مستقر، استمر في الدفاع عن تركيزك.";
    } catch { return "الاستمرارية هي أم الإتقان."; }
  };

  const toggleZenMode = (id: string | null) => {
    dispatch({ type: 'TOGGLE_ZEN', payload: id });
    if (id) logBehavior('zen_mode_enter', { taskId: id });
  };

  const t = useCallback((key: string): string => {
    const lang = 'ar';
    return (TRANSLATIONS as any)[lang][key] || key;
  }, []);

  const load = useMemo(() => BehaviorEngine.calculatePsychologicalLoad(state.tasks), [state.tasks]);

  return (
    <AppContext.Provider value={{ 
      ...state, 
      dispatch, 
      setState,
      addTask, 
      updateTask,
      toggleTask, 
      deleteTask, 
      deferTask,
      logBehavior, 
      generateWeeklySummary, 
      toggleZenMode, 
      t, 
      load,
      login,
      guestLogin,
      completeOnboarding,
      toggleDarkMode,
      setWeekMode,
      addHabit,
      toggleHabit,
      updateHabit,
      deleteHabit,
      addIdea,
      deleteIdea,
      convertIdeaToTask,
      processBrainDump
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
