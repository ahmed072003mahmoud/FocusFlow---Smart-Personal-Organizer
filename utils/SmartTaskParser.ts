
import { Category, Priority, Task } from '../types';

export class SmartTaskParser {
  static parse(input: string): Partial<Task> {
    const lower = input.toLowerCase();
    let category: Category = Category.OTHER;
    let deadline = new Date();
    let estimatedMinutes = 30;
    let time = "09:00 AM";

    const studyKeywords = /(study|math|read|book|exam|learn|درس|مذاكرة|كتاب|امتحان|دراسة|تذاكر)/;
    const habitKeywords = /(gym|run|walk|health|workout|exercise|meditation|جيم|رياضة|تمرين|مشي|صحة|عادات|عادة)/;
    const worshipKeywords = /(pray|quran|mosque|fajr|dhuhr|asr|maghrib|isha|worship|صلاة|قرآن|مسجد|فجر|ظهر|عصر|مغرب|عشاء|عبادة|دعاء)/;
    const workKeywords = /(work|email|project|meeting|audit|شغل|عمل|بريد|اجتماع|مشروع|وظيفة)/;

    if (studyKeywords.test(lower)) category = Category.STUDY;
    else if (habitKeywords.test(lower)) category = Category.HABIT;
    else if (worshipKeywords.test(lower)) category = Category.PRAYER;
    else if (workKeywords.test(lower)) category = Category.WORK;

    if (/(tomorrow|بكرة|غداً)/.test(lower)) {
      deadline.setDate(deadline.getDate() + 1);
    }

    // Arabic Time Expressions
    if (/(صباحاً|صباح|morning)/.test(lower)) time = "09:00 AM";
    else if (/(ظهراً|ظهر|noon)/.test(lower)) time = "12:00 PM";
    else if (/(عصراً|عصر|afternoon)/.test(lower)) time = "03:30 PM";
    else if (/(مساءً|مساء|ليل|evening|night)/.test(lower)) time = "08:00 PM";
    
    const arabicTimeMatch = lower.match(/(?:الساعة|ساعة)\s*(\d{1,2})/);
    if (arabicTimeMatch) {
      const h = parseInt(arabicTimeMatch[1]);
      const period = h < 12 && !lower.includes('مساء') ? 'AM' : 'PM';
      time = `${h.toString().padStart(2, '0')}:00 ${period}`;
    }

    const explicitTimeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|ص|م)/);
    if (explicitTimeMatch) {
      const hour = explicitTimeMatch[1];
      const minute = explicitTimeMatch[2] || "00";
      const period = (explicitTimeMatch[3] === 'ص' || explicitTimeMatch[3] === 'am') ? 'AM' : 'PM';
      time = `${hour.padStart(2, '0')}:${minute} ${period}`;
    }

    const hourMatch = lower.match(/(\d+)\s*(hour|hours|h|ساعة|ساعات)/);
    const minMatch = lower.match(/(\d+)\s*(min|mins|minutes|دقيقة|دقائق)/);
    
    if (hourMatch) estimatedMinutes = parseInt(hourMatch[1]) * 60;
    else if (minMatch) estimatedMinutes = parseInt(minMatch[1]);

    let title = input.replace(/(tomorrow|today|morning|afternoon|night|evening|for|hours|hour|h|min|minutes|at|in|on|بكرة|اليوم|غداً|صباح|مساء|ليل|ساعة|ساعات|دقيقة|دقائق|الساعة)/gi, '').trim();
    if (!title || title.length < 2) title = input;

    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      category,
      deadline: deadline.toISOString(),
      estimatedMinutes,
      time,
      priority: Priority.NORMAL,
      isCompleted: false
    };
  }
}
