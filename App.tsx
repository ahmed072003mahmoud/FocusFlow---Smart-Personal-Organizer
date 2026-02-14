
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import { Icons } from './constants';

// Views
import SplashScreen from './views/SplashScreen';
import LoginScreen from './views/LoginScreen';
import OnboardingScreen from './views/OnboardingScreen';
import DashboardScreen from './views/DashboardScreen';
import HabitsScreen from './views/HabitsScreen';
import AIPlanScreen from './views/AIPlanScreen';
import StatsScreen from './views/StatsScreen';
import SettingsScreen from './views/SettingsScreen';
import ContentScreen from './views/ContentScreen';
import ProfileScreen from './views/ProfileScreen';
import BrainDumpScreen from './views/BrainDumpScreen';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, hasSeenOnboarding, isHydrated } = useApp();
  
  if (!isHydrated) return <SplashScreen />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!hasSeenOnboarding) return <Navigate to="/onboarding" replace />;
  
  return <>{children}</>;
};

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { userName } = useApp();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <Icons.Home /> },
    { path: '/habits', label: 'Habits', icon: <Icons.Tasks /> },
    { path: '/brain-dump', label: 'Inbox', icon: <Icons.Inbox /> },
    { path: '/ai-plan', label: 'AI Plan', icon: <Icons.AI /> },
    { path: '/stats', label: 'Stats', icon: <Icons.Stats /> },
    { path: '/content', label: 'Tips', icon: <Icons.Tips /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-[#2B3A67] text-white h-screen sticky top-0 py-10 px-6 z-[70] shadow-2xl border-r border-white/5">
      <div className="flex items-center gap-4 px-2 mb-12">
        <div className="w-12 h-12 bg-[#E63946] rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">F</div>
        <span className="font-black tracking-tight text-2xl">FocusFlow</span>
      </div>

      <nav className="flex-1 flex flex-col gap-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 ${
                isActive ? 'bg-[#E63946] text-white shadow-xl shadow-[#E63946]/20' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

const BottomNav: React.FC = () => {
  const { pathname } = useLocation();
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <Icons.Home /> },
    { path: '/habits', label: 'Habits', icon: <Icons.Tasks /> },
    { path: '/brain-dump', label: 'Inbox', icon: <Icons.Inbox /> },
    { path: '/ai-plan', label: 'AI Plan', icon: <Icons.AI /> },
    { path: '/stats', label: 'Stats', icon: <Icons.Stats /> },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 bg-white rounded-[32px] px-2 py-3 flex justify-around items-center z-50 shadow-[0_20px_50px_rgba(43,58,103,0.15)] border border-white/50 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-[#E63946]' : 'text-slate-400'}`}
          >
            <div className={`p-2 rounded-2xl ${isActive ? 'bg-[#E63946]/10' : ''}`}>{item.icon}</div>
          </Link>
        );
      })}
    </nav>
  );
};

const MainScaffold: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { progress, language } = useApp();
  const { pathname } = useLocation();
  const isDesktop = window.innerWidth >= 800;
  const showNav = ['/dashboard', '/habits', '/ai-plan', '/stats', '/content', '/brain-dump'].includes(pathname);
  const isRtl = language === 'ar';

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {isDesktop && showNav && <Sidebar />}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/30">
        {showNav && (
          <div className="absolute top-0 left-0 right-0 z-[60] h-1 bg-[#E63946]/10">
            <div className="h-full bg-[#E63946] transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        )}
        <main className={`flex-1 overflow-y-auto no-scrollbar ${!isDesktop && showNav ? 'pb-32' : ''}`}>
           <div className={isDesktop && showNav ? "max-w-[1000px] mx-auto w-full px-8 pb-12" : ""}>{children}</div>
        </main>
        {!isDesktop && showNav && <BottomNav />}
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isHydrated } = useApp();
  const [isSplashing, setIsSplashing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated || isSplashing) return <SplashScreen />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><HabitsScreen /></ProtectedRoute>} />
      <Route path="/ai-plan" element={<ProtectedRoute><AIPlanScreen /></ProtectedRoute>} />
      <Route path="/stats" element={<ProtectedRoute><StatsScreen /></ProtectedRoute>} />
      <Route path="/content" element={<ProtectedRoute><ContentScreen /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
      <Route path="/brain-dump" element={<ProtectedRoute><BrainDumpScreen /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <MainScaffold>
          <AppRoutes />
        </MainScaffold>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
