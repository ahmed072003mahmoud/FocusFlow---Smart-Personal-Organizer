
import { Task, BehaviorEvent, UserPersona, BehaviorType, Priority } from '../types';
import { GoogleGenAI } from "@google/genai";

export interface AIDecision {
  type: 'overload' | 'procrastination' | 'morning_boost';
  confidence: number;
  payload: any;
  reason: string;
}

export class AIOrchestrationLayer {
  /**
   * Fast Low-Latency Analysis using Gemini 2.5 Flash Lite
   */
  static async fastTaskAnalysis(input: string): Promise<string> {
    // Instantiating per call to ensure latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `بسرعة فائقة، حلل هذه المهمة وحدد الفئة (دراسة، عمل، عادة) والمدة المتوقعة بالدقائق: "${input}"`
    });
    return response.text || "";
  }

  /**
   * Strategic Deep Thinking using Gemini 3 Pro
   */
  static async deepThinkStrategicPivot(problem: string): Promise<string> {
    // Instantiating per call to ensure latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `بصفتك مستشاراً تعليمياً رفيع المستوى، حلل هذه المعضلة الدراسية وقدم حلاً جذرياً بـ 3 أبعاد (نفسي، تقني، زمني): "${problem}"`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "";
  }

  /**
   * Search Grounding using Gemini 3 Flash
   */
  static async searchAcknowledge(query: string): Promise<{ text: string, sources: any[] }> {
    // Instantiating per call to ensure latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ابحث عن أحدث المعلومات الأكاديمية والموثقة حول: "${query}"`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }

  /**
   * Local Scenario Orchestrator
   */
  static async evaluateSituation(state: {
    tasks: Task[], 
    history: BehaviorEvent[], 
    persona: UserPersona,
    load: number
  }): Promise<AIDecision | null> {
    const { tasks, load } = state;
    const hour = new Date().getHours();

    // Signal: Cognitive Overload
    if (load > 90) {
      return {
        type: 'overload',
        confidence: 0.95,
        reason: 'Overload detected',
        payload: { strategy: 'shadow_mode' }
      };
    }

    // Signal: Avoidance Pattern
    const stuckTask = tasks.find(t => t.postponedCount >= 3 && !t.isCompleted);
    if (stuckTask) {
      return {
        type: 'procrastination',
        confidence: 0.88,
        reason: 'Repeated deferral',
        payload: { taskId: stuckTask.id }
      };
    }

    // Signal: Bio-Rhythm Sync
    if (hour >= 6 && hour <= 10 && tasks.some(t => t.priority === Priority.HIGH && !t.isCompleted)) {
      return {
        type: 'morning_boost',
        confidence: 0.90,
        reason: 'Peak energy window',
        payload: {}
      };
    }

    return null;
  }
}
