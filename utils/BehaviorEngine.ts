
import { BehaviorEvent, Task, Priority } from '../types';

export class BehaviorEngine {
  static analyze(history: BehaviorEvent[], tasks: Task[]): string | null {
    // Rule: Postponed 3 times -> Suggest Split
    const threeTimesPostponed = tasks.find(t => t.postponedCount >= 3 && !t.isCompleted);
    if (threeTimesPostponed) {
      return `Task "${threeTimesPostponed.title}" has been delayed 3 times. Try splitting it into smaller parts.`;
    }

    // Rule: Short sessions -> Low Energy check
    const today = new Date().toDateString();
    const todaySessions = history.filter(e => e.type === 'session_start' && new Date(e.timestamp).toDateString() === today);
    if (todaySessions.length > 5) {
      return "Frequent short sessions detected. Maybe you need a break or to enter Low Energy mode?";
    }

    return null;
  }

  static calculatePsychologicalLoad(tasks: Task[]): number {
    const uncompleted = tasks.filter(t => !t.isCompleted);
    const score = uncompleted.reduce((acc, t) => {
      const weight = t.priority === Priority.HIGH ? 1.5 : 1;
      return acc + (t.estimatedMinutes * weight);
    }, 0);
    
    // Normalize to 0-100 based on an 8-hour day (480 mins)
    return Math.min(100, Math.round((score / 480) * 100));
  }
}
