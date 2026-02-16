
import React from 'react';
import { useApp } from '../AppContext';

interface AIStrategicCueProps {
  type: 'overload' | 'procrastination' | 'morning_boost';
  onAction: () => void;
  onDismiss: () => void;
}

export const AIStrategicCue: React.FC<AIStrategicCueProps> = ({ type, onAction, onDismiss }) => {
  const content = {
    overload: {
      title: "الحمل النفسي مرتفع",
      desc: "نظامك الإدراكي يتجاوز 90%. نقترح حماية تركيزك عبر تفعيل وضع النجاة.",
      btn: "حماية التركيز",
      icon: "•"
    },
    procrastination: {
      title: "رصد عائق إدراكي",
      desc: "هذه المهمة تستهلك طاقة ذهنية بالتفكير فيها أكثر من تنفيذها. هل نبدأ بـ 120 ثانية؟",
      btn: "كسر الجمود",
      icon: "•"
    },
    morning_boost: {
      title: "إيقاع بيولوجي مثالي",
      desc: "أنت في نافذة طاقتك القصوى حالياً. الوقت مثالي لمهاجمة المهمة الأكبر.",
      btn: "استغلال الطاقة",
      icon: "•"
    }
  }[type];

  return (
    <div className="mx-8 p-10 bg-[#09090B] border border-white/5 rounded-[48px] animate-in slide-in-from-bottom-8 duration-500 shadow-2xl">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="text-4xl font-thin text-white">{content.icon}</div>
        <div className="space-y-2">
          <h4 className="system-caption text-zinc-400">{content.title}</h4>
          <p className="text-sm text-zinc-600 font-medium leading-relaxed max-w-[200px] mx-auto">{content.desc}</p>
        </div>
        
        <div className="w-full space-y-3 pt-4">
          <button 
            onClick={onAction}
            className="w-full bg-white text-black py-5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            {content.btn}
          </button>
          <button 
            onClick={onDismiss}
            className="w-full py-4 text-[9px] font-black text-zinc-700 uppercase tracking-widest hover:text-zinc-400 transition-colors"
          >
            تجاهل بصمت
          </button>
        </div>
      </div>
    </div>
  );
};
