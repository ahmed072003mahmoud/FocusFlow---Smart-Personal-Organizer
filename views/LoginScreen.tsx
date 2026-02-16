
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Logo } from '../components/Logo';

const LoginScreen: React.FC = () => {
  const { login, guestLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    login('User', email);
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020617] px-6">
      <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="text-center space-y-6">
          <div className="mx-auto relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <Logo size={80} className="relative z-10 mx-auto" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tight heading-title">مرحباً بعودتك</h2>
            <p className="text-slate-400 font-medium text-lg">صمم يومك بذكاء وهدوء.</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <input 
              type="email" 
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full px-7 py-5 bg-white/[0.03] border border-white/5 rounded-[25px] text-white focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition-all shadow-inner"
            />
            {error && <p className="text-[10px] font-black text-rose-400 px-4 uppercase tracking-widest">{error}</p>}
          </div>

          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-7 py-5 bg-white/[0.03] border border-white/5 rounded-[25px] text-white focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition-all shadow-inner"
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPass ? '👁️' : '🙈'}
            </button>
          </div>

          <button 
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-5 rounded-[25px] font-black uppercase tracking-[0.3em] text-xs transition-all ${isFormValid ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95' : 'bg-white/5 text-slate-600'}`}
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.5em]"><span className="bg-[#020617] px-6 text-slate-600 font-black">أو عبر</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 py-5 bg-white/[0.02] border border-white/5 rounded-[25px] text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.05] transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-70" alt="Google" /> Google
          </button>
          <button 
            onClick={guestLogin}
            className="flex items-center justify-center py-5 bg-white/[0.02] border border-white/5 rounded-[25px] text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.05] transition-all"
          >
            وضع الضيف
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
