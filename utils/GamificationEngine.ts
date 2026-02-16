
import { AppState, Badge, Category, Priority } from '../types';

export type ActionType = 
  | 'app_open' 
  | 'complete_task' 
  | 'update_task_honest' 
  | 'use_ai' 
  | 'daily_completion_check';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'quiet-starter',
    title: 'Quiet Starter',
    description: 'Use the app 3 days in a row.',
    tier: 'bronze',
    category: 'behavior',
    icon: 'Flame',
    isLocked: true,
    progress: 0
  },
  {
    id: 'the-resilient',
    title: 'The Resilient',
    description: 'Return after >2 days of inactivity.',
    tier: 'silver',
    category: 'behavior',
    icon: 'Shield',
    isLocked: true,
    progress: 0
  },
  {
    id: 'self-honest',
    title: 'Self-Honest',
    description: 'Adjusted a task instead of ignoring it.',
    tier: 'gold',
    category: 'behavior',
    icon: 'Check',
    isLocked: true,
    progress: 0
  },
  {
    id: 'prayer-guardian',
    title: 'Prayer Guardian',
    description: '7 days of all prayers tracked.',
    tier: 'gold',
    category: 'worship',
    icon: 'Mosque',
    isLocked: true,
    progress: 0
  },
  {
    id: 'soul-balance',
    title: 'Soul Balance',
    description: '1 Worship + 1 Habit + 1 Task in a day.',
    tier: 'silver',
    category: 'worship',
    icon: 'Flame',
    isLocked: true,
    progress: 0
  },
  {
    id: 'smart-planner',
    title: 'Smart Planner',
    description: 'Used AI suggestions 3 times.',
    tier: 'silver',
    category: 'planning',
    icon: 'AI',
    isLocked: true,
    progress: 0
  },
  {
    id: 'realist',
    title: 'Realist',
    description: 'Finish 80% of your daily plan.',
    tier: 'bronze',
    category: 'planning',
    icon: 'Trophy',
    isLocked: true,
    progress: 0
  }
];

export class GamificationEngine {
  static checkBadgeUpdates(state: AppState, action: ActionType): { updatedBadges: Badge[], newUnlock: Badge | null } {
    let newUnlock: Badge | null = null;
    const today = new Date().toISOString().split('T')[0];
    const updatedBadges = state.badges.map(badge => {
      if (!badge.isLocked) return badge;

      let newProgress = badge.progress;
      let shouldUnlock = false;

      switch (badge.id) {
        case 'quiet-starter':
          if (action === 'app_open') {
            // Logic handled in context to check consecutive days
            // Here we just represent the step
          }
          break;

        case 'the-resilient':
          if (action === 'app_open' && state.lastVisitDate) {
            const last = new Date(state.lastVisitDate).getTime();
            const now = new Date().getTime();
            const diffDays = (now - last) / (1000 * 3600 * 24);
            if (diffDays > 2) {
              newProgress = 100;
              shouldUnlock = true;
            }
          }
          break;

        case 'self-honest':
          if (action === 'update_task_honest') {
            newProgress += 20;
            if (newProgress >= 100) {
              newProgress = 100;
              shouldUnlock = true;
            }
          }
          break;

        case 'smart-planner':
          if (action === 'use_ai') {
            newProgress = (state.aiUsageCount / 3) * 100;
            if (newProgress >= 100) {
              newProgress = 100;
              shouldUnlock = true;
            }
          }
          break;

        case 'soul-balance':
          if (action === 'complete_task' || action === 'daily_completion_check') {
            const todayTasks = state.tasks.filter(t => t.isCompleted && t.deadline.startsWith(today));
            const hasWorship = todayTasks.some(t => t.category === Category.PRAYER);
            const hasHabit = state.habits.some(h => h.isCompletedToday);
            const hasTask = todayTasks.some(t => t.category === Category.STUDY || t.category === Category.WORK);
            
            if (hasWorship && hasHabit && hasTask) {
              newProgress = 100;
              shouldUnlock = true;
            }
          }
          break;
          
        case 'realist':
          if (action === 'daily_completion_check') {
             const todayTasks = state.tasks.filter(t => t.deadline.startsWith(today));
             const finished = todayTasks.filter(t => t.isCompleted).length;
             if (todayTasks.length >= 5 && (finished / todayTasks.length) >= 0.8) {
               newProgress = 100;
               shouldUnlock = true;
             }
          }
          break;
      }

      if (shouldUnlock && badge.isLocked) {
        newUnlock = { ...badge, isLocked: false, progress: 100, unlockedAt: new Date().toISOString(), isJustUnlocked: true };
        return newUnlock;
      }

      return { ...badge, progress: Math.min(newProgress, 100) };
    });

    return { updatedBadges, newUnlock };
  }
}
