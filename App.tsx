
import React, { Component, useState, useEffect, Suspense, lazy, ReactNode } from 'react';
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

// Fixed: Inheriting directly from Component to ensure 'this.props' and 'this.state' are correctly recognized by TypeScript.
class ErrorBoundary extends Component<EBProps, EBState> {
  public state: EBState = { hasError: false };

  static getDerivedStateFromError(_: Error): EBState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center p-12 text-center bg-[#09090B]">
          <h2 className="text-xl font-black text-zinc-100">نحتاج لهدوء</h2>
          <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-zinc-100 text-zinc-900 rounded-2xl font-black text-[10px] uppercase">إعادة المحاولة</button>
        </div>
      );
    }
    // Correctly return children from props
    return this.props.children;
  }
}

const NavigationDock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isZenModeActive, isFlowStateActive } = useApp();

  if (isZenModeActive || isFlowStateActive) return null;

  const navItems = [
    { path: '/', icon: <Icons.Home /> },
    { path: '/plan', icon: <Icons.AI /> },
    { path: '/capture', icon: <Icons.Inbox /> },
    { path: '/habits', icon: <Icons.Flame /> },
    { path: '/stats', icon: <Icons.Stats /> },
  ];

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-5 bg-zinc-950/40 backdrop-blur-3xl rounded-full flex items-center gap-10 z-[100] border border-white/[0.03] shadow-2xl">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`transition-all duration-500 relative ${isActive ? 'text-zinc-100 scale-125' : 'text-zinc-700 hover:text-zinc-500'}`}
          >
            {item.icon}
            {isActive && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-100 rounded-full shadow-[0_0_10px_white]" />}
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
    <div className="min-h-screen transition-colors duration-500 bg-[#09090B]">
      <ZenMode />
      <AmbientSoundPlayer />
      <main className={`${isZenModeActive ? 'hidden' : 'pb-40'}`}>
        <Suspense fallback={null}>
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
