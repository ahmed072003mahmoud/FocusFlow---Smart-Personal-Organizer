
import { AppState, Badge, BadgeTier } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b-stability',
    title: 'إيقاع ثابت',
    description: 'الحفاظ على وتيرة إنجاز متزنة لثلاثة أيام.',
    tier: 'stability',
    category: 'growth',
    icon: '⚖️',
    isLocked: true,
    progress: 0
  },
  {
    id: 'b-recovery',
    title: 'قوة العودة',
    description: 'استئناف المسار بعد فترة انقطاع بكل شجاعة.',
    tier: 'recovery',
    category: 'resilience',
    icon: '🌱',
    isLocked: true,
    progress: 0
  },
  {
    id: 'b-restraint',
    title: 'وعي الحدود',
    description: 'رفض إثقال اليوم بمهام إضافية عند وصول الحمل للذروة.',
    tier: 'restraint',
    category: 'wisdom',
    icon: '🛡️',
    isLocked: true,
    progress: 0
  }
];

export class GamificationEngine {
  static checkBadgeUpdates(state: AppState): Badge[] {
    return state.badges.map(badge => {
      if (!badge.isLocked) return badge;

      let shouldUnlock = false;

      if (badge.tier === 'stability') {
        // Logic: Check if last 3 days had at least 2 completions each
        const completions = state.tasks.filter(t => t.isCompleted).length;
        if (completions >= 6) shouldUnlock = true;
      }

      if (badge.tier === 'recovery') {
        // Logic: Gap in behavior history > 48h followed by new completions
        const history = state.behaviorHistory;
        if (history.length > 2) {
          const last = new Date(history[history.length - 1].timestamp).getTime();
          const prev = new Date(history[history.length - 2].timestamp).getTime();
          if ((last - prev) > (48 * 60 * 60 * 1000)) shouldUnlock = true;
        }
      }

      if (badge.tier === 'restraint') {
        // Logic: User stayed under 100% load even with backlog
        const activeCount = state.tasks.filter(t => !t.isCompleted).length;
        if (state.isComplexityKillSwitchActive && activeCount <= 5) shouldUnlock = true;
      }

      return shouldUnlock ? { ...badge, isLocked: false, unlockedAt: new Date().toISOString() } : badge;
    });
  }
}
