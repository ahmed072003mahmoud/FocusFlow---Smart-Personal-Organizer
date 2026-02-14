
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import { GOAL_OPTIONS } from '../constants';

const OnboardingScreen: React.FC = () => {
  const { selectedGoals, setGoals, completeOnboarding, login, userName: initialName } = useApp();
  const [name, setName] = useState(initialName || '');
  const navigate = useNavigate();

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = () => {
    if (!name.trim()) return;
    login(name);
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Scrollable container equivalent to SingleChildScrollView */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-8">
        <div className="mt-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-4xl font-black text-zinc-900 mb-2 tracking-tight">Welcome to FocusFlow</h2>
          <p className="text-zinc-500 font-medium">Let's set up your personal space.</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">What's your name?</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-zinc-900 font-bold"
            />
          </section>

          <section className="space-y-4 pb-8">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">What's your main goal today?</label>
            <div className="flex flex-wrap gap-3">
              {GOAL_OPTIONS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
                      isSelected 
                        ? 'bg-zinc-900 text-white border-transparent shadow-lg' 
                        : 'bg-zinc-50 text-zinc-500 border-zinc-100 hover:border-zinc-300'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Persistent button bar */}
      <div className="p-8 pt-0 bg-white">
        <button
          onClick={handleFinish}
          disabled={selectedGoals.length === 0 || !name.trim()}
          className="w-full bg-zinc-900 text-white font-bold py-5 rounded-[24px] shadow-2xl shadow-zinc-900/20 active:scale-95 transition-all disabled:opacity-50"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
