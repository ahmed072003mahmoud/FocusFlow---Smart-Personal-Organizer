
import { Category, Priority, WeekMode } from '../types';

export interface Suggestion {
  icon: string;
  label: string;
  duration: number;
  priority: Priority;
  titleSuffix?: string;
}

export class SmartSuggester {
  static getSuggestions(category: Category, weekMode: WeekMode = WeekMode.STANDARD): Suggestion[] {
    const hour = new Date().getHours();
    const suggestions: Suggestion[] = [];

    // 1. Crunch Mode Adaptation: Aggressive & Focused
    if (weekMode === WeekMode.CRUNCH && (category === Category.STUDY || category === Category.WORK)) {
       return [
         { icon: '🔥', label: 'Eat the Frog', duration: 120, priority: Priority.HIGH, titleSuffix: 'Massive Focus' },
         { icon: '🧠', label: 'Deep Work Block', duration: 90, priority: Priority.HIGH },
         { icon: '🚀', label: 'Sprint', duration: 45, priority: Priority.HIGH }
       ];
    }

    // 2. Light Mode Adaptation: Restorative & Small
    if (weekMode === WeekMode.LIGHT && (category === Category.STUDY || category === Category.WORK)) {
       return [
         { icon: '🌿', label: 'Tiny Task', duration: 15, priority: Priority.NORMAL },
         { icon: '🚶‍♂️', label: 'Walk & Learn', duration: 30, priority: Priority.NORMAL },
         { icon: '📖', label: 'Casual Review', duration: 20, priority: Priority.NORMAL }
       ];
    }

    // 3. Review Mode Adaptation: Reflective
    if (weekMode === WeekMode.REVIEW) {
      if (category === Category.STUDY || category === Category.WORK) {
        return [
          { icon: '🔍', label: 'System Audit', duration: 40, priority: Priority.NORMAL },
          { icon: '📅', label: 'Next Week Plan', duration: 25, priority: Priority.NORMAL },
          { icon: '📝', label: 'Organize Files', duration: 15, priority: Priority.NORMAL }
        ];
      }
    }

    // 4. Standard Context-Aware Logic
    if (category === Category.STUDY || category === Category.WORK) {
      if (hour >= 5 && hour < 12) {
        suggestions.push(
          { icon: '🐸', label: 'Eat the Frog', duration: 90, priority: Priority.HIGH, titleSuffix: 'Deep Work' },
          { icon: '🍅', label: 'Pomodoro', duration: 25, priority: Priority.NORMAL },
          { icon: '🧠', label: 'Focus Block', duration: 60, priority: Priority.HIGH }
        );
      } else if (hour >= 12 && hour < 18) {
        suggestions.push(
          { icon: '⚡', label: 'Quick Sprint', duration: 30, priority: Priority.NORMAL },
          { icon: '📅', label: 'Admin/Planning', duration: 15, priority: Priority.NORMAL },
          { icon: '🤝', label: 'Review', duration: 20, priority: Priority.NORMAL }
        );
      } else {
        suggestions.push(
          { icon: '📖', label: 'Light Review', duration: 45, priority: Priority.NORMAL },
          { icon: '📝', label: 'Tomorrow Prep', duration: 10, priority: Priority.NORMAL },
          { icon: '❌', label: 'Tidy Up', duration: 15, priority: Priority.NORMAL }
        );
      }
    } 

    if (category === Category.HABIT) {
      suggestions.push(
        { icon: '🧘', label: 'Meditate', duration: 10, priority: Priority.NORMAL },
        { icon: '🚶‍♂️', label: 'Walk', duration: 20, priority: Priority.NORMAL },
        { icon: '💧', label: 'Hydrate/Stretch', duration: 5, priority: Priority.NORMAL }
      );
    }

    if (category === Category.PRAYER) {
      suggestions.push(
        { icon: '📖', label: 'Reading', duration: 15, priority: Priority.HIGH },
        { icon: '🤲', label: 'Dua/Reflect', duration: 10, priority: Priority.NORMAL },
        { icon: '🕌', label: 'Mosque Trip', duration: 40, priority: Priority.HIGH }
      );
    }

    if (category === Category.OTHER) {
      suggestions.push(
        { icon: '😴', label: 'Power Nap', duration: 20, priority: Priority.NORMAL },
        { icon: '💤', label: '4 Cycles (6h)', duration: 360, priority: Priority.NORMAL, titleSuffix: 'Rest' },
        { icon: '✨', label: '5 Cycles (7.5h)', duration: 450, priority: Priority.NORMAL, titleSuffix: 'Full Rest' }
      );
    }

    return suggestions;
  }
}
