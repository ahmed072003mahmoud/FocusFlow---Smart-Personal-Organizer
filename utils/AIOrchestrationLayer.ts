
import { Task, BehaviorEvent, UserPersona, BehaviorType, Priority } from '../types';
import { GoogleGenAI } from "@google/genai";

export interface AIDecision {
  action: 'suggest' | 'silence' | 'reframe' | 'reduce';
  confidence: number;
  payload: any;
  reason: string;
}

export class AIOrchestrationLayer {
  private static CONFIDENCE_THRESHOLD = 0.85;

  /**
   * Logic Table:
   * Signal A: Load > 90% + Evening Time -> Action: Reduce Scope (Move to tomorrow)
   * Signal B: Task Deferral (3x) + Morning -> Action: Reframe (Micro-tasks)
   * Signal C: High Energy + Empty Timeline -> Action: Suggest (Strategic Project)
   */
  static async evaluateSituation(state: {
    tasks: Task[], 
    history: BehaviorEvent[], 
    persona: UserPersona,
    load: number
  }): Promise<AIDecision | null> {
    
    const { tasks, load, persona } = state;
    const hour = new Date().getHours();

    // SCENARIO: Cognitive Overload
    if (load > 90) {
      return {
        action: 'reduce',
        confidence: 0.95,
        reason: 'Cognitive load exceeding safe focus threshold.',
        payload: { tasksToShadow: tasks.filter(t => t.priority === Priority.NORMAL) }
      };
    }

    // SCENARIO: The "Wall" (Repeated avoidance)
    const stuckTask = tasks.find(t => t.postponedCount >= 3 && !t.isCompleted);
    if (stuckTask) {
      return {
        action: 'reframe',
        confidence: 0.88,
        reason: 'Task causing significant cognitive friction.',
        payload: { taskId: stuckTask.id, strategy: 'Micro-breakdown' }
      };
    }

    return null;
  }

  static async deepThinkStrategicPivot(problem: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // REQUIREMENT: Use gemini-3-pro-preview with max thinkingBudget
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `بصفتك مستشاراً تعليمياً رفيع المستوى، حلل هذه المعضلة الدراسية وقدم حلاً جذرياً: "${problem}"`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "";
  }
}
