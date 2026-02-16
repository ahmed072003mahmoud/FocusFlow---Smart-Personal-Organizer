
import React, { useState } from 'react';

interface OnboardingSpotlightProps {
  onComplete: () => void;
}

const STEPS = [
  {
    id: 'add',
    title: 'تصفية الذهن',
    desc: 'ابدأ هنا. أفرغ كل ما يدور في رأسك من مهام وأفكار لتقليل الضجيج الداخلي.',
    target: 'bottom-12 right-12', // Relative to screen but guides user
    position: 'bottom-36 right-8'
  },
  {
    id: 'focus',
    title: 'تركيز عميق',
    desc: 'مهمة واحدة في كل مرة. اضغط على أي مهمة ثم اختر "بدء التركيز" للدخول في وضع الـ Zen.',
    target: 'center',
    position: 'center'
  },
  {
    id: 'rituals',
    title: 'حمضك النووي',
    desc: 'العادات هي البنية التحتية للنجاح. تتبع طقوسك اليومية هنا لبناء هوية إنتاجية صلبة.',
    target: 'bottom-8 left-1/2',
    position: 'bottom-32 left-8 right-8'
  }
];

export const OnboardingSpotlight: React.FC<OnboardingSpotlightProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 overflow-hidden animate-in fade-in duration-500">
      {/* Background Dimming */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={next} />
      
      {/* Spotlight Circle (Simulated) */}
      <div className="relative z-[1001] w-full max-w-md space-y-8 text-center animate-in zoom-in slide-in-from-bottom-10 duration-700">
        <div className="space-y-4">
           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">الخطوة {currentStep + 1} / 3</span>
           <h2 className="text-4xl font-light text-white tracking-tighter">{step.title}</h2>
           <p className="text-zinc-400 text-sm leading-relaxed font-medium">
             {step.desc}
           </p>
        </div>

        <div className="pt-8">
           <button 
            onClick={next}
            className="px-12 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition-all"
           >
             {currentStep === STEPS.length - 1 ? 'ابدأ الرحلة' : 'التالي'}
           </button>
           <button 
            onClick={onComplete}
            className="block mx-auto mt-6 text-[8px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
           >
             تخطي الجولة
           </button>
        </div>
      </div>
    </div>
  );
};
