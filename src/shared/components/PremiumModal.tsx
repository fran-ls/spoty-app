import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
      {/* Semi-transparent backdrop shadow blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Actual Glass container */}
      <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl overflow-hidden z-10 animate-scale-up text-white select-none">

        {/* Background ambient glowing blob */}
        <div className="absolute -top-12.5 -left-12.5 w-40 h-40 bg-primary/20 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-12.5 -right-12.5 w-40 h-40 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Header containing Close button */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-primary font-bold font-label">
              Premium tier membership
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#adaaaa] hover:text-white hover:bg-white/5 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Large visual pitch headings */}
        <h2 className="text-3xl font-extrabold font-headline mb-4 tracking-tight leading-tight select-none">
          Gain Unlimited Audio Access
        </h2>

        <p className="text-[#adaaaa] text-xs sm:text-sm mb-6 leading-relaxed select-none">
          Elevate your spatial acoustics and immerse inside the perfect playlist. Ad-free, high-fidelity format, streaming continuous raw energy.
        </p>

        {/* Feature Checkpoints */}
        <div className="flex flex-col gap-3 mb-8 text-sm select-none">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary rounded-full p-1 shrink-0">
              <Check size={14} />
            </div>
            <span className="font-medium text-white/90">Zero commercial interruptions (Ad-Free)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary rounded-full p-1 shrink-0">
              <Check size={14} />
            </div>
            <span className="font-medium text-white/90">Download to local storage, play offline anytime</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary rounded-full p-1 shrink-0">
              <Check size={14} />
            </div>
            <span className="font-medium text-white/90">Extreme acoustic definition (320kbps raw quality)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary rounded-full p-1 shrink-0">
              <Check size={14} />
            </div>
            <span className="font-medium text-white/90">Continuous group jam sessions on any speaker device</span>
          </div>
        </div>

        {/* Pricing Actions Box */}
        <div className="bg-[#262626] border border-white/5 p-5 rounded-xl mb-6 flex items-center justify-between select-none">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#adaaaa] font-label block">
              Individual Member Plan
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              $9.99 <span className="text-xs font-semibold text-[#adaaaa]">/ month</span>
            </span>
          </div>
          <span className="bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] px-2 py-1 rounded-full uppercase tracking-wider select-none">
            Cancel Anytime
          </span>
        </div>

        {/* Call to action active triggers */}
        <button
          onClick={() => {
            alert('Congratulations! You have simulated the Premium Membership upgrade successfully.');
            onClose();
          }}
          className="w-full bg-primary hover:bg-[#63ef82] text-black font-extrabold py-3.5 rounded-full text-sm hover:scale-102 active:scale-98 transition-all shadow-xl shadow-primary/10 cursor-pointer"
        >
          Activate 3-Months Free Demo
        </button>

        <p className="text-[10.5px] text-[#adaaaa]/40 text-center mt-4 leading-normal select-none">
          By signing up, you agree to Spotify Web Player Terms. Offer applicable to experimental simulated applications only.
        </p>

      </div>
    </div>
  )
}
