
import React, { useState, useEffect, Suspense, lazy, ReactNode, Component } from 'react';
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
const Profile = lazy(() => import('./views/ProfileScreen'));
const Content = lazy(() => import('./views/ContentScreen'));

interface EBProps { children?: ReactNode; }
interface EBState { hasError: boolean; }

// Fixed: Error on line 36 by using Component directly and ensuring EBProps is properly typed for the class.
class ErrorBoundary extends Component<EBProps, EBState> {
  public state: EBState = { hasError: false };
  static getDerivedStateFromError(_: Error): EBState { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center p-12 text-center bg-black">
          <h2 className="text-xl text-white font-light tracking-widest">نحتاج لهدوء.. تعذر تحميل النظام.</h2>
          <button onClick={() => window.location.reload()} className="mt-8 px-10 py-4 bg-white text-black rounded-full system-caption text-[8px]">إعادة التموضع</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const NavigationDock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isZenModeActive, isFeatureUnlocked } = useApp();

  if (isZenModeActive) return null;

  const navItems = [
    { path: '/', icon: <Icons.Home />, unlocked: true },
    { path: '/plan', icon: <Icons.AI />, unlocked: isFeatureUnlocked('ai_lab') },
    { path: '/capture', icon: <Icons.Inbox />, unlocked: true },
    { path: '/habits', icon: <Icons.Flame />, unlocked: true },
    { path: '/stats', icon: <Icons.Stats />, unlocked: isFeatureUnlocked('dna_stats') },
    { path: '/settings', icon: <Icons.Gear />, unlocked: true },
  ];

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-zinc-950/20 backdrop-blur-3xl rounded-full flex items-center gap-8 z-[100] border border-white/[0.03] shadow-2xl">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`transition-all duration-700 relative ${isActive ? 'text-white scale-110' : 'text-zinc-800 hover:text-zinc-500'} ${!item.unlocked && 'opacity-10 grayscale'}`}
          >
            {item.icon}
            {isActive && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />}
          </button>
        );
      })}
      <button onClick={() => navigate('/profile')} className={`w-8 h-8 rounded-full border ${location.pathname === '/profile' ? 'border-white' : 'border-zinc-800'} overflow-hidden`}>
         <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-500 hover:text-white transition-colors">U</div>
      </button>
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
    <div className="min-h-screen bg-black transition-all duration-1000">
      <ZenMode />
      <AmbientSoundPlayer />
      <main className={`${isZenModeActive ? 'hidden' : 'relative'}`}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plan" element={<AIPlan />} />
            <Route path="/capture" element={<BrainDump />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/knowledge" element={<Content />} />
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
