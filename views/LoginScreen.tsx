
import React, { useState } from 'react';
import { useApp } from '../AppContext';

const LoginScreen: React.FC = () => {
  const { login, guestLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email field cannot be empty');
      return;
    }
    login('User', email);
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-gray-500 font-medium">Focus on what matters today.</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div className="space-y-1">
            <input 
              type="email" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
            {error && <p className="text-[10px] font-bold text-softRed px-1">{error}</p>}
          </div>

          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-4 text-gray-400 hover:text-primary"
            >
              {showPass ? '👁️' : '🙈'}
            </button>
          </div>

          <div className="flex items-center justify-end">
            <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot Password?</button>
          </div>

          <button 
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-btn font-black uppercase tracking-widest text-xs transition-all ${isFormValid ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-gray-200 text-gray-400'}`}
          >
            Sign In
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-4 text-gray-400 font-bold">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-4 bg-white border border-gray-100 rounded-btn text-xs font-bold hover:bg-gray-50 transition-all shadow-sm">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
          </button>
          <button 
            onClick={guestLogin}
            className="flex items-center justify-center py-4 bg-white border border-gray-100 rounded-btn text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
          >
            Guest Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
