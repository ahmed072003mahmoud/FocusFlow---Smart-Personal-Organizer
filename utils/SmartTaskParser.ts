
import { Category, Priority, Task } from '../types';

export class SmartTaskParser {
  static parse(input: string): Partial<Task> {
    const lower = input.toLowerCase();
    let category: Category = Category.OTHER;
    let deadline = new Date();
    let estimatedMinutes = 30;
    let time = "09:00 AM";

    // 1. Category Detection (Keywords)
    const studyKeywords = /(study|math|read|book|exam|learn|درس|مذاكرة|كتاب|امتحان)/;
    const habitKeywords = /(gym|run|walk|health|workout|exercise|meditation|جيم|رياضة|تمرين|مشي|صحة)/;
    const worshipKeywords = /(pray|quran|mosque|fajr|dhuhr|asr|maghrib|isha|worship|صلاة|قرآن|مسجد|فجر|ظهر|عصر|مغرب|عشاء|عبادة)/;
    const workKeywords = /(work|email|project|meeting|audit|شغل|عمل|بريد|اجتماع|مشروع)/;

    if (studyKeywords.test(lower)) category = Category.STUDY;
    else if (habitKeywords.test(lower)) category = Category.HABIT;
    else if (worshipKeywords.test(lower)) category = Category.PRAYER;
    else if (workKeywords.test(lower)) category = Category.WORK;

    // 2. Date Detection
    if (/(tomorrow|بكرة|غداً)/.test(lower)) {
      deadline.setDate(deadline.getDate() + 1);
    } else if (/(today|اليوم)/.test(lower)) {
      deadline = new Date();
    }

    // 3. Time Detection
    if (/(morning|صباح)/.test(lower)) time = "09:00 AM";
    else if (/(afternoon|عصر|ظهر)/.test(lower)) time = "03:00 PM";
    else if (/(night|evening|evening|ليل|مساء)/.test(lower)) time = "08:00 PM";
    
    // Explicit time like "10am" or "10:30pm"
    const explicitTimeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
    if (explicitTimeMatch) {
      const hour = explicitTimeMatch[1];
      const minute = explicitTimeMatch[2] || "00";
      const period = explicitTimeMatch[3].toUpperCase();
      time = `${hour.padStart(2, '0')}:${minute} ${period}`;
    }

    // 4. Duration Detection
    // Look for "2 hours", "30 min", "1h", "45 mins"
    const hourMatch = lower.match(/(\d+)\s*(hour|hours|h|ساعة|ساعات)/);
    const minMatch = lower.match(/(\d+)\s*(min|mins|minutes|دقيقة|دقائق)/);
    
    if (hourMatch) {
      estimatedMinutes = parseInt(hourMatch[1]) * 60;
    } else if (minMatch) {
      estimatedMinutes = parseInt(minMatch[1]);
    }

    // 5. Title Extraction (Remove extracted keywords to get the core title)
    // We remove some common filler words and date/time markers
    let title = input.replace(/(tomorrow|today|morning|afternoon|night|evening|for|hours|hour|h|min|minutes|at|in|on|بكرة|اليوم|غداً|صباح|مساء|ليل|ساعة|ساعات|دقيقة|دقائق)/gi, '').trim();
    
    // Clean up extra spaces
    title = title.replace(/\s\s+/g, ' ');
    
    if (!title || title.length < 2) {
      title = input;
    }

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
