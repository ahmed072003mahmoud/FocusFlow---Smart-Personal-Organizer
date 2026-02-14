
import React from 'react';
import { Task, Habit, Priority, Category, Challenge } from './types';

export const INITIAL_TASKS: Task[] = [];

export const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'ch-sniper',
    title: 'Sniper Focus',
    description: 'Complete 100% of your daily tasks for 3 consecutive days.',
    targetDays: 3,
    currentStreak: 0,
    isActive: false,
    isCompleted: false
  },
  {
    id: 'ch-guardian',
    title: 'Prayer Guardian',
    description: 'Complete all 5 prayers on time for 7 consecutive days.',
    targetDays: 7,
    currentStreak: 0,
    isActive: false,
    isCompleted: false
  },
  {
    id: 'ch-no-delay',
    title: 'Zero Delay',
    description: 'Finish all tasks without a single postponement for 5 days.',
    targetDays: 5,
    currentStreak: 0,
    isActive: false,
    isCompleted: false
  }
];

export const GOAL_TASK_MAPPING: Record<string, Partial<Task>> = {
  'Study': { title: 'Focused Study Session', category: Category.STUDY, priority: Priority.HIGH, time: '10:00 AM' },
  'Habits': { title: 'Track Morning Habits', category: Category.HABIT, priority: Priority.NORMAL, time: '08:30 AM' },
  'Prayers': { title: 'Morning Prayer & Reflection', category: Category.PRAYER, priority: Priority.HIGH, time: '05:00 AM' },
  'Health': { title: 'Quick Physical Stretch', category: Category.HABIT, priority: Priority.NORMAL, time: '07:30 AM' },
  'Finance': { title: 'Daily Budget Review', category: Category.STUDY, priority: Priority.NORMAL, time: '06:00 PM' },
  'Work': { title: 'Email & Schedule Audit', category: Category.STUDY, priority: Priority.NORMAL, time: '09:00 AM' },
};

export const INITIAL_HABITS: Habit[] = [
  { id: 'h1', name: 'Drink 2L Water', streakCount: 12, isCompletedToday: false, lastCompletedDate: '', createdAt: new Date().toISOString(), description: 'Maintaining daily hydration for peak performance.', history: [] },
  { id: 'h2', name: 'Meditation', streakCount: 5, isCompletedToday: true, lastCompletedDate: new Date().toLocaleDateString(), createdAt: new Date().toISOString(), description: 'Morning mindfulness to start the day with clarity.', history: [new Date().toISOString().split('T')[0]] },
  { id: 'h3', name: 'Reading', streakCount: 8, isCompletedToday: false, lastCompletedDate: '', createdAt: new Date().toISOString(), description: 'Daily intellectual growth.', history: [] },
];

export const GOAL_OPTIONS = ['Study', 'Habits', 'Prayers', 'Health', 'Finance', 'Work'];

export const TRANSLATIONS = {
  en: {
    dashboard_title: 'Good Morning',
    tasks: 'Tasks',
    habits: 'Habits',
    settings: 'Settings',
    add_task: 'Add Task',
    prayers: 'Prayers',
    language: 'Language',
    // Existing keys
    welcome: 'Welcome',
    organizeDay: "Let's get your day organized.",
    yourName: 'Your Name',
    getStarted: 'Get Started',
    focusQuestion: "What's your focus?",
    selectGoal: 'Select at least one goal to personalize your dashboard.',
    completeSetup: 'Complete Setup',
    goodMorning: 'Good Morning',
    tasksRemaining: 'You have {count} tasks remaining today.',
    todo: 'To Do',
    done: 'Done',
    timeline: "Today's Timeline",
    sortedTime: 'Sorted by Time',
    manageProd: 'Manage your productivity',
    filters: 'Filters',
    highPriority: 'High Priority',
    normalTasks: 'Normal Tasks',
    aiPlan: 'Smart Daily Planner',
    smartRoutines: 'Smart routines for you.',
    aiInsight: 'AI Insight',
    activeHabits: 'Active Habits',
    total: 'total',
    streak: 'Streak',
    consistency: 'Consistency',
    stats: 'Stats',
    visualize: 'Visualize your consistency.',
    weeklyActivity: 'Weekly Activity',
    completionRate: 'Completion Rate',
    tasksCompletedWeek: 'You completed 12 tasks this week!',
    habitStreaks: 'Habit Streaks',
    totalStreak: 'Total Streak',
    peakHour: 'Peak Hour',
    customize: 'Customize your experience.',
    accountDetails: 'Account Details',
    notifications: 'Push Notifications',
    signOut: 'Sign Out',
    save: 'Save',
    cancel: 'Cancel',
    editTask: 'Edit Task',
    newTask: 'New Task',
    taskTitle: 'Task Title',
    time: 'Time',
    priority: 'Priority',
    category: 'Category',
    add: 'Add Task',
    update: 'Update Task',
    markDone: 'Mark Done',
    clearHabits: 'Clear Habits?',
    clearConfirm: 'This will delete all your current habits. This action cannot be undone.',
    yesClear: 'Yes, Clear All',
    howFeel: 'How are you feeling?',
    topPriority: 'Focus for today?',
    availHours: 'Available Hours?',
    generateSchedule: 'Generate My Schedule',
    addToMyDay: 'Task added to your day!',
    resetPlanner: 'Start Over',
    thinking: 'AI is crafting your perfect day...',
    moodEnergetic: 'Energetic',
    moodTired: 'Tired',
    moodFocused: 'Focused',
    moodStressed: 'Stressed',
    prioStudy: 'Study',
    prioHealth: 'Health',
    prioWorship: 'Worship',
    habitOverview: 'Habit Overview',
    todayHabitCompletion: 'Today\'s Completion',
    smartInsights: 'Smart Insights',
    productivityTip: 'You are most productive on Tuesdays! Keep up the great work in the mornings.',
    habitsDone: '{count} of {total} done'
  },
  ar: {
    dashboard_title: 'صباح الخير',
    tasks: 'المهام',
    habits: 'العادات',
    settings: 'الإعدادات',
    add_task: 'إضافة مهمة',
    prayers: 'الصلوات',
    language: 'اللغة',
    // Existing keys
    welcome: 'مرحباً بك',
    organizeDay: 'لنقم بتنظيم يومك.',
    yourName: 'اسمك',
    getStarted: 'ابدأ الآن',
    focusQuestion: 'ما هو تركيزك؟',
    selectGoal: 'اختر هدفاً واحداً على الأقل لتخصيص لوحة التحكم الخاصة بك.',
    completeSetup: 'إكمال الإعداد',
    goodMorning: 'صباح الخير',
    tasksRemaining: 'لديك {count} مهام متبقية اليوم.',
    todo: 'للقيام به',
    done: 'منجز',
    timeline: 'الجدول الزمني لليوم',
    sortedTime: 'مرتب حسب الوقت',
    manageProd: 'إدارة إنتاجيتك',
    filters: 'الفلاتر',
    highPriority: 'أولوية قصوى',
    normalTasks: 'مهام عادية',
    aiPlan: 'مخطط يومي ذكي',
    smartRoutines: 'روتين ذكي مصمم لك.',
    aiInsight: 'رؤية الذكاء الاصطناعي',
    activeHabits: 'العادات النشطة',
    total: 'الإجمالي',
    streak: 'سلسلة النجاح',
    consistency: 'الاستمرارية',
    stats: 'الإحصائيات',
    visualize: 'تصور استمراريتك.',
    weeklyActivity: 'النشاط الأسبوعي',
    completionRate: 'معدل الإكمال',
    tasksCompletedWeek: 'لقد أكملت 12 مهمة هذا الأسبوع!',
    habitStreaks: 'سلاسل العادات',
    totalStreak: 'إجمالي السلسلة',
    peakHour: 'ساعة الذروة',
    customize: 'خصص تجربتك.',
    accountDetails: 'تفاصيل الحساب',
    notifications: 'تنبيهات الدفع',
    signOut: 'تسجيل الخروج',
    save: 'حفظ',
    cancel: 'إلغاء',
    editTask: 'تعديل المهمة',
    newTask: 'مهمة جديدة',
    taskTitle: 'عنوان المهمة',
    time: 'الوقت',
    priority: 'الأولوية',
    category: 'الفئة',
    add: 'إضافة مهمة',
    update: 'تحديث المهمة',
    markDone: 'تم الإنجاز',
    clearHabits: 'مسح العادات؟',
    clearConfirm: 'سيؤدي هذا إلى حذف جميع عاداتك الحالية. لا يمكن التراجع عن هذا الإجراء.',
    yesClear: 'نعم، مسح الكل',
    howFeel: 'كيف تشعر؟',
    topPriority: 'تركيز اليوم؟',
    availHours: 'الساعات المتاحة؟',
    generateSchedule: 'توليد جدولي',
    addToMyDay: 'تمت إضافة المهمة ليومك!',
    resetPlanner: 'البدء من جديد',
    thinking: 'الذكاء الاصطناعي يصمم يومك المثالي...',
    moodEnergetic: 'نشيط',
    moodTired: 'متعب',
    moodFocused: 'مركز',
    moodStressed: 'مجهد',
    prioStudy: 'دراسة',
    prioHealth: 'صحة',
    prioWorship: 'عبادة',
    habitOverview: 'نظرة عامة على العادات',
    todayHabitCompletion: 'إكمال اليوم',
    smartInsights: 'رؤى ذكية',
    productivityTip: 'أنت أكثر إنتاجية في أيام الثلاثاء! استمر في العمل الرائع في الصباح.',
    habitsDone: 'تم إنجاز {count} من {total}'
  }
};

export const Icons = {
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Tasks: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  ),
  AI: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  ),
  Stats: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  Tips: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Flame: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C12 2 7 6.5 7 11s3 8 5 8 5-3.5 5-8-5-8.5-5-8.5zM12 16c-1.1 0-2-.9-2-2.1 0-1.1.9-2.1 2-2.1s2 .9 2 2.1c0 1.2-.9 2.1-2 2.1z"/></svg>
  ),
  Share: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
  ),
  Mosque: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21v-7"/><path d="M19 21v-7"/><path d="M9 21v-4a3 3 0 0 1 6 0v4"/><path d="M2 11a10 10 0 0 1 20 0"/><path d="M12 2v2"/><path d="M12 7V5"/></svg>
  ),
  People: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Trophy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  ),
  Coffee: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
  ),
  Inbox: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
  ),
  Gear: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  )
};
