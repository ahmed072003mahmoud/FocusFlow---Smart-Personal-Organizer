
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useApp, AppProvider } from './AppContext';
import SplashScreen from './views/SplashScreen';
import LoginScreen from './views/LoginScreen';
import OnboardingScreen from './views/OnboardingScreen';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ZenMode } from './components/ZenMode';
import { AmbientSoundPlayer } from './components/AmbientSoundPlayer';

// Lazy loading for speed
const Dashboard = lazy(() => import('./views/DashboardScreen'));
const BrainDump = lazy(() => import('./views/BrainDumpScreen'));
const AIPlan = lazy(() => import('./views/AIPlanScreen'));
const Habits = lazy(() => import('./views/HabitsScreen'));
const Stats = lazy(() => import('./views/StatsScreen'));
const Settings = lazy(() => import('./views/SettingsScreen'));

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { 
    super(props); 
    this.state = { hasError: false }; 
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center p-12 text-center bg-white">
           <span className="text-4xl mb-4">🧘</span>
           <h2 className="text-xl font-black text-[#2B3A67]">Take a deep breath...</h2>
           <p className="text-slate-500 mt-2 text-sm">We're fixing a small hiccup. Please refresh.</p>
           <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-[#2B3A67] text-white font-black rounded-2xl text-xs uppercase tracking-widest">Refresh App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SunsetModeOverlay = () => {
  const [isSunset, setIsSunset] = useState(false);
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) setIsSunset(true);
  }, []);
  if (!isSunset) return null;
  return <div className="sunset-overlay" />;
};

const AppContent: React.FC = () => {
  const { isLoggedIn, hasSeenOnboarding, isDarkMode, isFlowStateActive, isZenModeActive } = useApp();
  const [isSplashing, setIsSplashing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashing) return <SplashScreen />;
  if (!isLoggedIn) return <LoginScreen />;
  if (!hasSeenOnboarding) return <OnboardingScreen />;

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-[#F8F9FA] dark:bg-darkBg transition-colors overflow-y-auto no-scrollbar`}>
      <SunsetModeOverlay />
      <ZenMode />
      <AmbientSoundPlayer />
      
      {!isZenModeActive && (
        <header className="fixed top-0 w-full z-[150] glass-effect h-16 flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#E63946] rounded-lg flex items-center justify-center text-white font-bold">F</div>
             <span className="font-black text-[#2B3A67] dark:text-white tracking-tight">FocusFlow</span>
             <div className="ml-2 w-2 h-2 rounded-full bg-emerald-500 opacity-50 shadow-sm" title="Cloud Sync Active" />
          </div>
          <nav className="flex gap-6">
            {!isFlowStateActive && (
              <>
                <button onClick={() => window.location.hash = '#/'} className="text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-[#2B3A67] dark:hover:text-white">Today</button>
                <button onClick={() => window.location.hash = '#/plan'} className="text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-[#2B3A67] dark:hover:text-white">Plan</button>
              </>
            )}
            <button onClick={() => window.location.hash = '#/capture'} className="text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-[#2B3A67] dark:hover:text-white">Capture</button>
          </nav>
        </header>
      )}
      
      <main className={`${isZenModeActive ? 'hidden' : 'pt-4 pb-24'}`}>
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#2B3A67] border-t-transparent rounded-full animate-spin" /></div>}>
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

      {!isZenModeActive && (
        <footer className="fixed bottom-0 left-0 right-0 h-20 glass-effect border-t border-slate-100 dark:border-white/10 flex items-center justify-around px-6 z-[150]">
          <button onClick={() => window.location.hash = '#/'} className="flex flex-col items-center gap-1">
            <span className="text-lg">🏠</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Home</span>
          </button>
          <button onClick={() => window.location.hash = '#/habits'} className="flex flex-col items-center gap-1">
            <span className="text-lg">🔥</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Habits</span>
          </button>
          <button onClick={() => window.location.hash = '#/stats'} className="flex flex-col items-center gap-1">
            <span className="text-lg">✨</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">DNA</span>
          </button>
          <button onClick={() => window.location.hash = '#/settings'} className="flex flex-col items-center gap-1">
            <span className="text-lg">⚙️</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Set</span>
          </button>
        </footer>
      )}
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