
import { BehaviorEvent, Task, Priority } from '../types';

export class BehaviorEngine {
  static analyze(history: BehaviorEvent[], tasks: Task[]): string | null {
    const uncompleted = tasks.filter(t => !t.isCompleted);
    const load = this.calculatePsychologicalLoad(tasks);

    // Shadow Negotiation Logic
    if (load > 90) {
      return "Critical Load detected. I've quietly moved your non-essential tasks to 'Shadow Mode' to protect your focus.";
    }

    const threeTimesPostponed = tasks.find(t => t.postponedCount >= 3 && !t.isCompleted);
    if (threeTimesPostponed) {
      return `The Negotiator: "${threeTimesPostponed.title}" is causing friction. Should we break it into 10-minute micro-tasks?`;
    }

    return null;
  }

  static calculatePeakHour(history: BehaviorEvent[]): number {
    const completions = history.filter(e => e.type === 'task_complete');
    if (completions.length === 0) return 9;
    const hours = completions.map(e => new Date(e.timestamp).getHours());
    const counts = hours.reduce((acc, h) => {
      acc[h] = (acc[h] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    return Number(Object.keys(counts).reduce((a, b) => counts[Number(a)] > counts[Number(b)] ? a : b));
  }

  static calculatePsychologicalLoad(tasks: Task[]): number {
    const uncompleted = tasks.filter(t => !t.isCompleted);
    const score = uncompleted.reduce((acc, t) => {
      const weight = t.priority === Priority.HIGH ? 2.0 : 1.0;
      //Tasks that are postponed multiple times weigh heavier on the mind
      const frictionPenalty = 1 + (t.postponedCount * 0.2);
      return acc + (t.estimatedMinutes * weight * frictionPenalty);
    }, 0);
    // 480 minutes (8 hours) is our baseline for a "Full Mind"
    return Math.min(100, Math.round((score / 480) * 100));
  }

  static getShadowNegotiation(tasks: Task[]): Task[] {
    const load = this.calculatePsychologicalLoad(tasks);
    if (load <= 85) return tasks;

    // Sort tasks: keep HIGH priority and Prayer, move Others to "Shadow"
    return tasks.map(t => {
      if (!t.isCompleted && t.priority === Priority.NORMAL && t.category !== 'Prayer') {
        return { ...t, timeSlot: undefined, priorityScore: 10 }; // Quietly demote
      }
      return t;
    });
  }
}
