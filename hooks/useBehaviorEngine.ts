
import { useCallback } from 'react';
import { useApp } from '../AppContext';
import { BehaviorType } from '../types';

export const useBehaviorEngine = () => {
  const { logBehavior } = useApp();

  const triggerHaptic = useCallback((type: 'success' | 'warning' | 'click') => {
    if (!navigator.vibrate) return;
    switch (type) {
      case 'success': navigator.vibrate([30, 50, 30]); break;
      case 'warning': navigator.vibrate(100); break;
      case 'click': navigator.vibrate(10); break;
    }
  }, []);

  const trackAction = useCallback((type: BehaviorType, metadata?: any) => {
    logBehavior(type, metadata);
    if (type === 'task_complete') triggerHaptic('success');
  }, [logBehavior, triggerHaptic]);

  return { trackAction, triggerHaptic };
};
