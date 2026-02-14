
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { Task, Habit, AppState, Category, Language, Priority, Challenge, SuccessLog, Idea } from './types';
import { INITIAL_HABITS, TRANSLATIONS, GOAL_TASK_MAPPING, DEFAULT_CHALLENGES } from './constants';
import { SmartTaskParser } from './utils/SmartTaskParser';
import { GoogleGenAI, Type } from "@google/genai";

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
  t: (key: keyof typeof TRANSLATIONS.en | string) => string; // Extended key type
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

const STORAGE_KEY = 'focusflow_v11_gamified_final_ideas';
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
      language: savedLang || 'ar', // Default to Arabic as requested
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
      }
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        if (parsed.intentionDate !== todayStr) {
          parsed.dailyIntention = '';
          parsed.intentionDate = todayStr;
        }
        return { ...fallback, ...parsed, language: savedLang || parsed.language || 'ar' };
      } catch (e) { console.error(e); }
    }
    return fallback;
  };

  const [state, setState] = useState<AppState>(getInitialState);

  const checkVictoryCondition = useCallback((tasks: Task[]) => {
    const todayStr = new Date().toDateString();
    const todayTasks = tasks.filter(t => new Date(t.deadline).toDateString() === todayStr);
    
    if (todayTasks.length < 3) return;

    const completionRate = todayTasks.filter(t => t.isCompleted).length / todayTasks.length;
    const alreadyLogged = state.successLogs.some(log => new Date(log.date).toDateString() === todayStr);

    if (completionRate >= 0.8 && !alreadyLogged) {
      setVictoryDayPending(true);
    }
  }, [state.successLogs]);

  const saveSuccessLog = useCallback((secretSauce: string) => {
    const todayStr = new Date().toISOString();
    const todayTasks = state.tasks.filter(t => new Date(t.deadline).toDateString() === new Date().toDateString());
    const completionRate = todayTasks.filter(t => t.isCompleted).length / todayTasks.length;

    const newLog: SuccessLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: todayStr,
      tasksCompleted: todayTasks.filter(t => t.isCompleted).length,
      secretSauce,
      productivityScore: completionRate
    };

    setState(prev => ({ ...prev, successLogs: [newLog, ...prev.successLogs] }));
    setVictoryDayPending(false);
    setMilestone("Day of Victory Logged! 🌟");
  }, [state.tasks]);

  const dismissVictory = () => setVictoryDayPending(false);

  const generateDailyPrayers = useCallback((currentTasks: Task[]): Task[] => {
    const today = new Date().toISOString().split('T')[0];
    const existingPrayers = currentTasks.filter(t => t.isWorship && t.deadline.startsWith(today));
    
    if (existingPrayers.length >= 5) return currentTasks;

    const newPrayers: Task[] = PRAYERS_CONFIG.map(p => {
      const deadlineDate = new Date();
      deadlineDate.setHours(Math.floor(p.hour), (p.hour % 1) * 60, 0, 0);
      
      return {
        id: `prayer-${p.name}-${today}`,
        title: p.name,
        isCompleted: false,
        deadline: deadlineDate.toISOString(),
        scheduledTime: deadlineDate.toISOString(),
        time: p.time,
        priority: Priority.HIGH,
        estimatedMinutes: 20,
        actualMinutes: 0,
        isRunning: false,
        postponedCount: 0,
        category: Category.PRAYER,
        createdAt: new Date().toISOString(),
        priorityScore: 100,
        isFixedTime: true,
        isWorship: true
      };
    });

    return [...newPrayers, ...currentTasks];
  }, []);

  const checkDailyChallengeProgress = useCallback((currentState: AppState): AppState => {
    const todayStr = new Date().toDateString();
    const activeChallenges = currentState.challenges.filter(c => c.isActive && !c.isCompleted && c.lastProcessedDate !== todayStr);
    
    if (activeChallenges.length === 0) return currentState;

    const tasks = currentState.tasks;
    const updatedChallenges = currentState.challenges.map(challenge => {
      if (!challenge.isActive || challenge.isCompleted || challenge.lastProcessedDate === todayStr) return challenge;

      let success = false;
      if (challenge.id === 'ch-sniper') {
         success = tasks.length > 0 && tasks.every(t => t.isCompleted);
      } else if (challenge.id === 'ch-guardian') {
         const prayerTasks = tasks.filter(t => t.isWorship);
         success = prayerTasks.length >= 5 && prayerTasks.every(t => t.isCompleted);
      } else if (challenge.id === 'ch-no-delay') {
         success = tasks.length > 0 && tasks.every(t => t.isCompleted && t.postponedCount === 0);
      }

      if (success) {
        const newStreak = challenge.currentStreak + 1;
        const isCompleted = newStreak >= challenge.targetDays;
        if (isCompleted) setMilestone(`Challenge Master: ${challenge.title} Unlocked! 🏆`);
        return { ...challenge, currentStreak: newStreak, isCompleted, lastProcessedDate: todayStr };
      } else {
        return { ...challenge, currentStreak: 0, lastProcessedDate: todayStr };
      }
    });

    return { ...currentState, challenges: updatedChallenges };
  }, []);

  useEffect(() => { setIsHydrated(true); }, []);
  
  useEffect(() => {
    if (isHydrated && state.isLoggedIn) {
      setState(prev => {
        const withPrayers = generateDailyPrayers(prev.tasks);
        const newState = { ...prev, tasks: withPrayers };
        return checkDailyChallengeProgress(newState);
      });
    }
  }, [isHydrated, state.isLoggedIn]);

  useEffect(() => {
    if (isHydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, isHydrated]);

  const overloadInfo = useMemo((): OverloadInfo => {
    const uncompletedToday = state.tasks.filter(t => !t.isCompleted);
    const totalMinutes = uncompletedToday.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);
    const isOverloaded = totalMinutes > state.dailyAvailableMinutes;
    let suggested: Task[] = [];
    let excessMinutes = 0;
    
    if (isOverloaded) {
      excessMinutes = totalMinutes - state.dailyAvailableMinutes;
      const sorted = [...uncompletedToday].filter(t => !t.isFixedTime).sort((a, b) => a.priorityScore - b.priorityScore);
      let gatheredMinutes = 0;
      for (const t of sorted) {
        suggested.push(t);
        gatheredMinutes += t.estimatedMinutes;
        if (gatheredMinutes >= excessMinutes) break;
      }
    }
    return { isOverloaded, excessMinutes, suggestedToPostpone: suggested, totalTaskMinutes: totalMinutes };
  }, [state.tasks, state.dailyAvailableMinutes]);

  const toggleTaskTimer = useCallback((id: string) => {
    setState(prev => {
      const now = new Date();
      return {
        ...prev,
        tasks: prev.tasks.map(t => {
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
      
      if (isFinishing && task.isRunning) {
        const elapsed = Math.round((now.getTime() - new Date(task.lastStartTime!).getTime()) / 60000);
        finalActual += elapsed;
      }

      const newTasks = prev.tasks.map(t => id === t.id ? { 
        ...t, 
        isCompleted: !t.isCompleted, 
        isRunning: false, 
        actualMinutes: finalActual,
        lastStartTime: undefined 
      } : t);
      
      if (isFinishing) {
        const est = task.estimatedMinutes;
        const act = finalActual;
        
        if (act > est * 1.2) {
          setRealityCheck({ taskId: id, actual: act, estimated: est, type: 'fallacy' });
        } else if (act < est * 0.8 && act > 0) {
          setRealityCheck({ taskId: id, actual: act, estimated: est, type: 'speedy' });
        }

        if (act > 0) {
          const ratio = act / est;
          const oldBias = prev.categoryBias[task.category] || 1.0;
          const newBias = (oldBias + ratio) / 2;
          prev.categoryBias[task.category] = newBias;
        }

        const totalDone = newTasks.filter(t => t.isCompleted).length;
        if (totalDone === 10) setMilestone("The Professional: 10 Tasks Mastery");
        if (totalDone === 50) setMilestone("The Strategist: 50 Tasks Consistency");
        
        checkVictoryCondition(newTasks);
      }

      return { ...prev, tasks: newTasks, categoryBias: { ...prev.categoryBias } };
    });
  }, [state.successLogs, checkVictoryCondition]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'priorityScore' | 'postponedCount' | 'isFixedTime' | 'isWorship' | 'actualMinutes' | 'isRunning' | 'lastStartTime'>) => {
    const bias = state.categoryBias[taskData.category] || 1.0;
    const adjustedMinutes = Math.round(taskData.estimatedMinutes * bias);
    const score = calculatePriorityScore({ ...taskData, estimatedMinutes: adjustedMinutes });
    const newTask: Task = { 
      ...taskData, 
      estimatedMinutes: adjustedMinutes,
      id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(), 
      priorityScore: score, 
      postponedCount: 0,
      actualMinutes: 0,
      isRunning: false,
      isFixedTime: false,
      isWorship: false
    };
    setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  }, [state.categoryBias]);

  const updateTask = useCallback((updatedTask: Task) => {
    setState(prev => {
      const existingTask = prev.tasks.find(t => t.id === updatedTask.id);
      let postponedCount = updatedTask.postponedCount;
      if (existingTask && updatedTask.deadline > existingTask.deadline) postponedCount += 1;
      const taskWithNewScore = { ...updatedTask, postponedCount, priorityScore: calculatePriorityScore({ ...updatedTask, postponedCount }) };
      return { ...prev, tasks: prev.tasks.map(t => t.id === updatedTask.id ? taskWithNewScore : t) };
    });
  }, []);

  const autoBalance = useCallback((tasksToPostpone: Task[]) => {
    setState(prev => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const updatedTasks = prev.tasks.map(task => {
        if (tasksToPostpone.find(t => t.id === task.id)) {
          return { ...task, deadline: tomorrow.toISOString(), postponedCount: task.postponedCount + 1, scheduledTime: undefined };
        }
        return task;
      });
      return { ...prev, tasks: updatedTasks };
    });
  }, []);

  const addIdea = useCallback((text: string) => {
    const newIdea: Idea = { id: Math.random().toString(36).substr(2, 9), text, capturedAt: new Date().toISOString() };
    setState(prev => ({ ...prev, ideas: [newIdea, ...prev.ideas] }));
  }, []);

  const deleteIdea = useCallback((id: string) => {
    setState(prev => ({ ...prev, ideas: prev.ideas.filter(i => i.id !== id) }));
  }, []);

  const convertIdeaToTask = useCallback(async (id: string, useAI: boolean = false) => {
    const idea = state.ideas.find(i => i.id === id);
    if (!idea) return;

    let parsed: Partial<Task>;

    if (useAI) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract a task from this raw thought: "${idea.text}". Return as JSON with properties: title, category (Study, Habit, Prayer, Work, Other), estimatedMinutes, priority (High, Normal), deadline (ISO string, assume relative to ${new Date().toISOString()}).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              estimatedMinutes: { type: Type.NUMBER },
              priority: { type: Type.STRING },
              deadline: { type: Type.STRING }
            },
            required: ["title", "category", "estimatedMinutes", "priority", "deadline"]
          }
        }
      });
      
      try {
        const aiResult = JSON.parse(response.text);
        parsed = {
          ...aiResult,
          category: (Object.values(Category) as string[]).includes(aiResult.category) ? aiResult.category as Category : Category.OTHER,
          priority: aiResult.priority === 'High' ? Priority.HIGH : Priority.NORMAL
        };
      } catch (e) {
        console.error("AI Parse failed, falling back to local", e);
        parsed = SmartTaskParser.parse(idea.text);
      }
    } else {
      parsed = SmartTaskParser.parse(idea.text);
    }

    const bias = state.categoryBias[parsed.category!] || 1.0;
    const adjustedMinutes = Math.round(parsed.estimatedMinutes! * bias);
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: parsed.title!,
      isCompleted: false,
      deadline: parsed.deadline!,
      estimatedMinutes: adjustedMinutes,
      actualMinutes: 0,
      isRunning: false,
      postponedCount: 0,
      category: parsed.category!,
      createdAt: new Date().toISOString(),
      priorityScore: calculatePriorityScore({ ...parsed, estimatedMinutes: adjustedMinutes }),
      isFixedTime: false,
      isWorship: false,
      time: parsed.time
    };

    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      ideas: prev.ideas.filter(i => i.id !== id)
    }));
  }, [state.ideas, state.categoryBias]);

  const toggleSurvivalMode = useCallback(() => setState(prev => ({ ...prev, isSurvivalMode: !prev.isSurvivalMode })), []);
  const toggleBadDayMode = useCallback((value: boolean) => setState(prev => ({ ...prev, isBadDayMode: value, notificationsEnabled: !value })), []);
  const toggleDarkMode = useCallback(() => setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode })), []);
  const setDailyAvailableMinutes = useCallback((minutes: number) => setState(prev => ({ ...prev, dailyAvailableMinutes: minutes })), []);
  const clearMilestone = useCallback(( ) => setMilestone(null), []);
  const clearRealityCheck = useCallback(() => setRealityCheck(null), []);
  const setDailyIntention = useCallback((text: string) => setState(prev => ({ ...prev, dailyIntention: text, intentionDate: new Date().toDateString() })), []);
  const joinChallenge = useCallback((id: string) => setState(prev => ({
     ...prev, 
     challenges: prev.challenges.map(c => c.id === id ? { ...c, isActive: true, currentStreak: 0, lastProcessedDate: new Date().toDateString() } : c)
  })), []);

  const organizeMyDay = useCallback(async () => {
    await new Promise(r => setTimeout(r, 1200));
    setState(prev => {
      let currentPointer = new Date();
      currentPointer.setMinutes(Math.ceil(currentPointer.getMinutes() / 5) * 5);
      currentPointer.setSeconds(0); currentPointer.setMilliseconds(0);
      const fixedTasks = prev.tasks.filter(t => t.isFixedTime && !t.isCompleted);
      const flexibleTasks = [...prev.tasks].filter(t => !t.isCompleted && !t.isFixedTime).sort((a, b) => b.priorityScore - a.priorityScore);
      const updatedTasks = prev.tasks.map(task => {
        if (task.isCompleted || task.isFixedTime) return task;
        const foundFlex = flexibleTasks.find(t => t.id === task.id);
        if (!foundFlex) return task;
        let scheduledTime = currentPointer.toISOString();
        let taskEnd = new Date(currentPointer.getTime() + task.estimatedMinutes * 60000);
        for (const fixed of fixedTasks) {
          const fixedStart = new Date(fixed.scheduledTime!);
          const fixedEnd = new Date(fixedStart.getTime() + fixed.estimatedMinutes * 60000);
          if (taskEnd > fixedStart && currentPointer < fixedEnd) {
             currentPointer = new Date(fixedEnd.getTime() + 5 * 60000); 
             scheduledTime = currentPointer.toISOString();
             taskEnd = new Date(currentPointer.getTime() + task.estimatedMinutes * 60000);
          }
        }
        currentPointer = new Date(taskEnd.getTime() + 5 * 60000);
        return { ...task, scheduledTime };
      });
      return { ...prev, tasks: updatedTasks };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => {
      const taskToDelete = prev.tasks.find(t => t.id === id);
      if (taskToDelete) setLastDeletedTask(taskToDelete);
      return { ...prev, tasks: prev.tasks.filter(t => t.id !== id) };
    });
  }, []);

  const undoDeleteTask = useCallback(() => {
    if (lastDeletedTask) {
      setState(prev => ({ ...prev, tasks: [lastDeletedTask, ...prev.tasks] }));
      setLastDeletedTask(null);
    }
  }, [lastDeletedTask]);

  const clearCompletedTasks = useCallback(() => setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => !t.isCompleted) })), []);
  
  const addHabit = (h: { name: string, description: string }) => {
    const newH: Habit = { id: Math.random().toString(36).substr(2,9), ...h, streakCount: 0, isCompletedToday: false, createdAt: new Date().toISOString(), history: [] };
    setState(p => ({ ...p, habits: [newH, ...p.habits] }));
  };
  const updateHabit = (h: Habit) => setState(p => ({ ...p, habits: p.habits.map(x => x.id === h.id ? h : x) }));
  const deleteHabit = (id: string) => setState(p => ({ ...p, habits: p.habits.filter(x => x.id !== id) }));
  const toggleHabit = (id: string) => {
    const isoDate = new Date().toISOString().split('T')[0];
    setState(p => ({
      ...p,
      habits: p.habits.map(h => {
        if (h.id !== id) return h;
        const willBeDone = !h.isCompletedToday;
        return {
          ...h,
          isCompletedToday: willBeDone,
          streakCount: willBeDone ? h.streakCount + 1 : Math.max(0, h.streakCount - 1),
          history: willBeDone ? [...h.history, isoDate] : h.history.filter(d => d !== isoDate)
        };
      })
    }));
  };
  const clearAllHabits = () => setState(p => ({ ...p, habits: [] }));
  const setGoals = (goals: string[]) => setState(prev => ({ ...prev, selectedGoals: goals }));
  const login = (name: string) => setState(prev => ({ ...prev, userName: name, isLoggedIn: true }));
  const logout = () => { localStorage.removeItem(STORAGE_KEY); window.location.reload(); };
  const clearAllData = () => { localStorage.clear(); window.location.reload(); };

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem(LANG_KEY, lang);
    setState(prev => ({ ...prev, language: lang }));
  }, []);

  const completeOnboarding = () => {
    const generated: Omit<Task, 'id' | 'createdAt' | 'priorityScore' | 'postponedCount' | 'isFixedTime' | 'isWorship' | 'actualMinutes' | 'isRunning' | 'lastStartTime'>[] = state.selectedGoals.map(goal => {
      const mapping = GOAL_TASK_MAPPING[goal];
      return { title: mapping?.title || goal, isCompleted: false, category: mapping?.category || Category.OTHER, deadline: new Date().toISOString(), estimatedMinutes: 30, priority: mapping?.priority || Priority.NORMAL, time: mapping?.time || '09:00 AM' };
    });
    const finalTasks = generated.map(t => ({ 
      ...t, 
      id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(), 
      priorityScore: calculatePriorityScore(t), 
      postponedCount: 0,
      actualMinutes: 0,
      isRunning: false,
      isFixedTime: false,
      isWorship: false
    }));
    setState(prev => ({ ...prev, hasSeenOnboarding: true, tasks: [...finalTasks, ...prev.tasks] }));
  };

  const t = (key: string): string => {
    const translationSet = (TRANSLATIONS as any)[state.language] || TRANSLATIONS.en;
    return translationSet[key] || key;
  };
  const progress = state.tasks.length > 0 ? (state.tasks.filter(t => t.isCompleted).length / state.tasks.length) * 100 : 0;

  return (
    <AppContext.Provider value={{ 
      ...state, addTask, updateTask, deleteTask, undoDeleteTask, toggleTask, toggleTaskTimer,
      clearCompletedTasks, organizeMyDay, autoBalance, overloadInfo, setDailyAvailableMinutes, 
      toggleSurvivalMode, toggleBadDayMode, toggleDarkMode, addHabit, updateHabit, deleteHabit, toggleHabit, clearAllHabits,
      setGoals, login, logout, clearAllData, completeOnboarding, setLanguage, t, progress, lastDeletedTask, isHydrated,
      milestone, clearMilestone, realityCheck, clearRealityCheck, victoryDayPending, saveSuccessLog, dismissVictory, 
      setDailyIntention, joinChallenge, addIdea, deleteIdea, convertIdeaToTask
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
