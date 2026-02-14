
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const LoginScreen: React.FC = () => {
  const [name, setName] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name);
      navigate('/onboarding');
    }
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white">
      <div className="mt-16 mb-12">
        <h2 className="text-4xl font-bold text-zinc-900 mb-2">Welcome</h2>
        <p className="text-zinc-500">Let's get your day organized.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6 flex-1">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Your Name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-zinc-900 placeholder:text-zinc-300"
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-zinc-900 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-zinc-900/10 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          Get Started
        </button>
      </form>

      <p className="text-center text-zinc-400 text-xs mt-auto py-8">
        By continuing, you agree to FocusFlow's terms of service.
      </p>
    </div>
  );
};

export default LoginScreen;
