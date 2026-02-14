
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
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
import BuddyScreen from './views/BuddyScreen';
import ProfileScreen from './views/ProfileScreen';
import BrainDumpScreen from './views/BrainDumpScreen';

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { userName } = useApp();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <Icons.Home /> },
    { path: '/habits', label: 'Habits', icon: <Icons.Tasks /> },
    { path: '/brain-dump', label: 'Inbox', icon: <Icons.Inbox /> }, // NEW
    { path: '/ai-plan', label: 'AI Plan', icon: <Icons.AI /> },
    { path: '/stats', label: 'Stats', icon: <Icons.Stats /> },
    { path: '/content', label: 'Tips', icon: <Icons.Tips /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-[#2B3A67] text-white h-screen sticky top-0 py-10 px-6 z-[70] shadow-2xl border-r border-white/5">
      <div className="flex items-center gap-4 px-2 mb-12">
        <div className="w-12 h-12 bg-[#E63946] rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-[#E63946]/20">
          F
        </div>
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
                isActive 
                  ? 'bg-[#E63946] text-white shadow-xl shadow-[#E63946]/20' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/10">
        <Link to="/profile" className="flex items-center gap-4 px-4 py-4 hover:bg-white/5 rounded-3xl transition-all group">
          <div className="w-12 h-12 bg-[#E63946] rounded-2xl flex items-center justify-center font-black text-white shadow-lg">
            {userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="font-black truncate text-sm tracking-tight">{userName || 'Explorer'}</p>
            <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-0.5 group-hover:text-[#E63946] transition-colors">View Profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

const BottomNav: React.FC = () => {
  const { pathname } = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <Icons.Home /> },
    { path: '/habits', label: 'Habits', icon: <Icons.Tasks /> },
    { path: '/brain-dump', label: 'Inbox', icon: <Icons.Inbox /> }, // NEW
    { path: '/ai-plan', label: 'AI Plan', icon: <Icons.AI /> },
    { path: '/stats', label: 'Stats', icon: <Icons.Stats /> },
    { path: '/content', label: 'Tips', icon: <Icons.Tips /> },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 bg-white rounded-[32px] px-2 py-3 flex justify-around items-center z-50 shadow-[0_20px_50px_rgba(43,58,103,0.15)] border border-white/50 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-[#E63946] scale-110' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-[#E63946]/10' : 'bg-transparent'}`}>
              {item.icon}
            </div>
            <span className={`text-[8px] font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

const MainScaffold: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { progress, language } = useApp();
  const { pathname } = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 800);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const showNav = ['/dashboard', '/habits', '/ai-plan', '/stats', '/content', '/brain-dump'].includes(pathname);
  const isRtl = language === 'ar';

  return (
    <div 
      className={`flex h-screen bg-[#F1FAEE] overflow-hidden transition-all duration-500`} 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {isDesktop && showNav && <Sidebar />}

      <div className={`flex-1 flex flex-col h-full relative overflow-hidden ${!isDesktop ? 'max-w-md mx-auto shadow-2xl bg-[#F1FAEE] border-x border-slate-100' : 'bg-slate-50/30'}`}>
        {showNav && (
          <div className="absolute top-0 left-0 right-0 z-[60]">
            <div className="h-1 bg-white/20 w-full">
              <div 
                className="h-full bg-[#E63946] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(230,57,70,0.5)]" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto no-scrollbar ${!isDesktop && showNav ? 'pb-32' : ''}`}>
           <div className={isDesktop && showNav ? "max-w-[1000px] mx-auto w-full px-8 pb-12" : ""}>
            {children}
           </div>
        </main>
        
        {!isDesktop && showNav && <BottomNav />}
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isLoggedIn, hasSeenOnboarding } = useApp();
  const [isSplashing, setIsSplashing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashing(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashing) return <SplashScreen />;

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Navigate 
            to={isLoggedIn ? (hasSeenOnboarding ? "/dashboard" : "/onboarding") : "/login"} 
            replace 
          />
        } 
      />
      
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/habits" element={<HabitsScreen />} />
      <Route path="/ai-plan" element={<AIPlanScreen />} />
      <Route path="/stats" element={<StatsScreen />} />
      <Route path="/content" element={<ContentScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/buddy" element={<BuddyScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/brain-dump" element={<BrainDumpScreen />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
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
