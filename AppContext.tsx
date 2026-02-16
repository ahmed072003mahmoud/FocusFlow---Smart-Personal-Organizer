
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { Task, AppState, Priority, BehaviorEvent, WeekMode, Badge } from './types';
import { INITIAL_HABITS, DEFAULT_CHALLENGES } from './constants';
import { INITIAL_BADGES, GamificationEngine } from './utils/GamificationEngine';
import { BehaviorEngine } from './utils/BehaviorEngine';

type Action = 
  | { type: 'SET_STATE'; payload: Partial<AppState> }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'TOGGLE_ZEN'; payload: string | null }
  | { type: 'LOG_BEHAVIOR'; payload: BehaviorEvent };

const STORAGE_KEY = 'focus_flow_v11_monochrome';

interface AppContextType extends AppState {
  dispatch: React.Dispatch<Action>;
  addTask: (t: any) => void;
  toggleZenMode: (id: string | null) => void;
  load: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE': return { ...state, ...action.payload };
    case 'ADD_TASK': return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'TOGGLE_ZEN': return { ...state, isZenModeActive: !!action.payload, zenTaskId: action.payload };
    case 'LOG_BEHAVIOR': 
      const newHistory = [...state.behaviorHistory, action.payload];
      return { ...state, behaviorHistory: newHistory };
    default: return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null, () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Fixed: Initializing AppState with mandatory persona property
    const fallback: AppState = {
      tasks: [], habits: [], challenges: [], successLogs: [], ideas: [],
      isLoggedIn: false, hasSeenOnboarding: false, isDarkMode: true,
      userName: 'طالب ذكي', behaviorHistory: [], badges: INITIAL_BADGES,
      isZenModeActive: false, zenTaskId: null, currentWeekMode: WeekMode.STANDARD,
      isComplexityKillSwitchActive: false,
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
      }
    };
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  });

  useEffect(() => {
    const updatedBadges = GamificationEngine.checkBadgeUpdates(state);
    if (JSON.stringify(updatedBadges) !== JSON.stringify(state.badges)) {
      dispatch({ type: 'SET_STATE', payload: { badges: updatedBadges } });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const load = useMemo(() => BehaviorEngine.calculatePsychologicalLoad(state.tasks), [state.tasks]);

  return (
    <AppContext.Provider value={{ 
      ...state, dispatch, 
      addTask: (t) => dispatch({ type: 'ADD_TASK', payload: { ...t, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), postponedCount: 0, isCompleted: false, priorityScore: 50 } }),
      toggleZenMode: (id) => {
        dispatch({ type: 'TOGGLE_ZEN', payload: id });
        dispatch({ type: 'LOG_BEHAVIOR', payload: { type: 'zen_mode_enter', timestamp: new Date().toISOString() } });
      },
      load
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
