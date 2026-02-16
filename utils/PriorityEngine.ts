
import { Task, Priority } from '../types';

export class PriorityEngine {
  /**
   * Calculates a dynamic score for a task.
   * score = (priorityWeight * 2) + (dueSoonWeight * 3) + (complexityWeight)
   */
  static calculateScore(task: Task): number {
    const priorityWeight = task.priority === Priority.HIGH ? 10 : 2;
    
    // Due Soon Logic: Tasks due today or tomorrow get higher weight
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let dueSoonWeight = 0;
    if (diffHours < 0) dueSoonWeight = 15; // Overdue
    else if (diffHours < 24) dueSoonWeight = 10; // Due today
    else if (diffHours < 48) dueSoonWeight = 5; // Due tomorrow
    
    // Complexity Weight: estimatedMinutes / average focus session
    const complexityWeight = Math.min(task.estimatedMinutes / 25, 5);

    // Friction Penalty from AppContext logic
    const frictionPenalty = 1 + (task.postponedCount * 0.5);

    return Math.round((priorityWeight * 2 + dueSoonWeight * 3 + complexityWeight) * frictionPenalty);
  }

  static sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      return this.calculateScore(b) - this.calculateScore(a);
    });
  }
}
