
import React, { useState, useEffect, Suspense, lazy, ReactNode } from 'react';
import { useApp, AppProvider } from './AppContext';
import SplashScreen from './views/SplashScreen';
import LoginScreen from './views/LoginScreen';
import OnboardingScreen from './views/OnboardingScreen';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ZenMode } from './components/ZenMode';
import { AmbientSoundPlayer } from './components/AmbientSoundPlayer';
import { Icons } from './constants';

const Dashboard = lazy(() => import('./views/DashboardScreen'));
const AIPlan = lazy(() => import('./views/AIPlanScreen'));
const BrainDump = lazy(() => import('./views/BrainDumpScreen'));
const Stats = lazy(() => import('./views/StatsScreen'));
const Settings = lazy(() => import('./views/SettingsScreen'));
const Habits = lazy(() => import('./views/HabitsScreen'));

interface EBProps { children?: ReactNode; }
interface EBState { hasError: boolean; }

// Fixed: Using React.Component and explicitly declaring the state property to resolve property existence errors in TypeScript.
class ErrorBoundary extends React.Component<EBProps, EBState> {
  // Explicitly declaring state to ensure it's recognized by the class instance
  public state: EBState = { hasError: false };

  constructor(props: EBProps) {
    super(props);
  }
  
  static getDerivedStateFromError() { return { hasError: true }; }
  
  render() {
    // Accessing state inherited from React.Component
    if (this.state.hasError) return (
      <div className="h-screen flex flex-col items-center justify-center p-12 text-center bg-[#020617]">
        <span className="text-6xl mb-8 animate-bounce">💆‍♂️</span>
        <h2 className="text-2xl font-black text-white">نحتاج إلى وقفة تأمل</h2>
        <p className="text-slate-400 mt-2 font-medium">حدث خطأ تقني غير متوقع. دعنا نستعيد التوازن.</p>
        <button onClick={() => window.location.reload()} className="mt-10 px-10 py-4 bg-indigo-600 text-white rounded-[25px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20">إعادة المحاولة</button>
      </div>
    );
    // Accessing props inherited from React.Component
    return this.props.children;
  }
}

const NavigationDock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isZenModeActive, isFlowStateActive } = useApp();

  if (isZenModeActive || isFlowStateActive) return null;

  const navItems = [
    { path: '/', icon: <Icons.Home />, label: 'الرئيسية' },
    { path: '/plan', icon: <Icons.AI />, label: 'الذكاء' },
    { path: '/capture', icon: <Icons.Inbox />, label: 'تفريغ' },
    { path: '/habits', icon: <Icons.Flame />, label: 'عادات' },
    { path: '/stats', icon: <Icons.Stats />, label: 'إحصائيات' },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-lg p-2.5 glass-card rounded-[35px] flex items-center justify-between z-[100] transition-all duration-500 border-white/10">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative flex items-center justify-center h-14 rounded-[28px] transition-all duration-500 ${
              isActive ? 'bg-indigo-500 text-white px-8 shadow-lg shadow-indigo-500/20 grow' : 'text-slate-500 w-14 hover:text-slate-200'
            }`}
          >
            <div className={`transition-all duration-500 ${isActive ? 'scale-110' : 'scale-90 opacity-60'}`}>
              {item.icon}
            </div>
            {isActive && (
              <span className="mr-3 text-[11px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-3 duration-500">
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn, hasSeenOnboarding, isZenModeActive } = useApp();
  const [isSplashing, setIsSplashing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashing) return <SplashScreen />;
  if (!isLoggedIn) return <LoginScreen />;
  if (!hasSeenOnboarding) return <OnboardingScreen />;

  return (
    <div className="min-h-screen transition-colors duration-500 bg-[#020617]">
      <ZenMode />
      <AmbientSoundPlayer />
      <main className={`${isZenModeActive ? 'hidden' : 'pb-36'}`}>
        <Suspense fallback={
          <div className="h-screen flex flex-col items-center justify-center gap-6">
             <div className="w-12 h-12 border-[4px] border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">جاري تحميل المسارات...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plan" element={<AIPlan />} />
            <Route path="/capture" element={<BrainDump />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
      <NavigationDock />
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <HashRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </HashRouter>
  </ErrorBoundary>
);

export default App;
