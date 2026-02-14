
import { Task, Category } from '../types';

export interface ProductivityDNA {
  peakDay: string;
  temporalProfile: string;
  focusStyle: string;
  topCategory: string;
  isLocked: boolean;
  completionCount: number;
}

export const generateProductivityDNA = (tasks: Task[]): ProductivityDNA => {
  const completedTasks = tasks.filter(t => t.isCompleted);
  const count = completedTasks.length;

  if (count < 5) {
    return {
      peakDay: '',
      temporalProfile: '',
      focusStyle: '',
      topCategory: '',
      isLocked: true,
      completionCount: count
    };
  }

  // 1. Peak Day Analysis
  const weekdayMap: Record<number, number> = {};
  completedTasks.forEach(t => {
    const day = new Date(t.createdAt).getDay();
    weekdayMap[day] = (weekdayMap[day] || 0) + 1;
  });
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const peakDayIndex = Object.keys(weekdayMap).reduce((a, b) => weekdayMap[Number(a)] > weekdayMap[Number(b)] ? a : b);
  const peakDay = days[Number(peakDayIndex)];

  // 2. Temporal Profile (Morning, Afternoon, Night)
  const hourMap: Record<string, number> = { Morning: 0, Afternoon: 0, Night: 0 };
  completedTasks.forEach(t => {
    const hour = new Date(t.createdAt).getHours();
    if (hour >= 5 && hour < 12) hourMap.Morning++;
    else if (hour >= 12 && hour < 18) hourMap.Afternoon++;
    else hourMap.Night++;
  });
  const temporalProfile = Object.keys(hourMap).reduce((a, b) => hourMap[a] > hourMap[b] ? a : b);

  // 3. Focus Style
  const highPrioCompletions = completedTasks.filter(t => t.priorityScore > 60).length;
  const focusStyle = highPrioCompletions / count > 0.4 ? 'Sniper Focus' : 'Consistent Volume';

  // 4. Top Category
  const catMap: Record<string, number> = {};
  completedTasks.forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + 1;
  });
  const topCategory = Object.keys(catMap).reduce((a, b) => catMap[a] > catMap[b] ? a : b, 'Other');

  return {
    peakDay,
    temporalProfile: temporalProfile === 'Morning' ? 'Early Strategist' : temporalProfile === 'Afternoon' ? 'Mid-Day Executor' : 'Night Owl',
    focusStyle,
    topCategory,
    isLocked: false,
    completionCount: count
  };
};
