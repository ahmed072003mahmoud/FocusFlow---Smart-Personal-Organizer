
import { useCallback } from 'react';
import { useApp } from '../AppContext';
import { BehaviorType } from '../types';
import { GamificationEngine } from '../utils/GamificationEngine';

export const useBehaviorEngine = () => {
  const { setState, setMilestone } = useApp() as any;

  const logBehavior = useCallback((type: BehaviorType, metadata?: any) => {
    setState((s: any) => {
      const { updatedBadges, newUnlock } = GamificationEngine.checkBadgeUpdates(s, type as any);
      if (newUnlock) setMilestone(`Badge Unlocked: ${newUnlock.title}! 🏆`);
      
      // Haptics integration
      if (type === 'task_complete' && navigator.vibrate) {
        navigator.vibrate(20);
      }
      if (newUnlock && navigator.vibrate) {
        navigator.vibrate([30, 10, 30]);
      }

      return {
        ...s,
        behaviorHistory: [...s.behaviorHistory, { type, timestamp: new Date().toISOString(), metadata }],
        badges: updatedBadges,
        aiUsageCount: type === 'use_ai' ? s.aiUsageCount + 1 : s.aiUsageCount
      };
    });
  }, [setState, setMilestone]);

  return { logBehavior };
};
