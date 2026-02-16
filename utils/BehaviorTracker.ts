
// Changed BehaviorEventType to BehaviorType to match exports in types.ts
import { BehaviorEvent, UserPersona, BehaviorType } from '../types';

export class BehaviorTracker {
  static analyzePatterns(history: BehaviorEvent[]): UserPersona {
    const completions = history.filter(e => e.type === 'task_complete');
    const postpones = history.filter(e => e.type === 'task_postpone');

    // Initialize with all required properties from UserPersona interface
    const persona: UserPersona = {
      isMorningPerson: true,
      avgCompletionTime: '00:00',
      currentMood: 'Focused',
      dailyIntention: '',
      energyLevel: 100,
      isOverloaded: false,
      consistencyScore: 0,
      energyProfile: 'mixed',
      completionStyle: 'sprinter',
      overwhelmTrigger: 5,
      deepWorkHours: 0
    };

    if (completions.length < 5) return persona;

    // 1. Energy Profile Heuristic
    const completionHours = completions.map(e => new Date(e.timestamp).getHours());
    const morningCompletions = completionHours.filter(h => h >= 5 && h <= 12).length;
    const nightCompletions = completionHours.filter(h => h >= 18 || h <= 3).length;

    if (morningCompletions / completions.length > 0.6) persona.energyProfile = 'morning_person';
    else if (nightCompletions / completions.length > 0.6) persona.energyProfile = 'night_owl';

    // 2. Completion Style Heuristic
    const avgDuration = completions.reduce((acc, e) => acc + (e.metadata?.estimatedMinutes || 30), 0) / completions.length;
    persona.completionStyle = avgDuration >= 45 ? 'marathoner' : 'sprinter';

    // 3. Overwhelm Trigger Heuristic
    // Find the number of tasks existing when the first postpone of the day happens
    const dayPostpones = postpones.length;
    if (dayPostpones > 0) {
      // Simplistic: adjust trigger based on frequency
      persona.overwhelmTrigger = Math.max(3, 8 - Math.floor(dayPostpones / 2));
    }

    return persona;
  }

  static shouldTriggerSoftAsk(lastPromptTime?: string): boolean {
    if (!lastPromptTime) return true;
    const last = new Date(lastPromptTime).getTime();
    const now = new Date().getTime();
    const diffHours = (now - last) / (1000 * 3600);
    return diffHours >= 24;
  }
}