'use client';

import { motion } from 'framer-motion';
import { Megaphone, Sparkles } from 'lucide-react';

const AD_CONTENTS = [
  {
    headline: 'Level Up Your Skills',
    subtext: 'Premium courses from top creators. Start learning today.',
    cta: 'Explore Courses',
    gradient: 'from-[#f97316]/10 to-[#f59e0b]/10',
    accent: '#f97316',
  },
  {
    headline: 'Creative Cloud Suite',
    subtext: 'Design, edit, and collaborate — all in one platform.',
    cta: 'Try Free',
    gradient: 'from-[#f59e0b]/10 to-[#f43f5e]/10',
    accent: '#f59e0b',
  },
  {
    headline: 'Deploy in Seconds',
    subtext: 'Ship your apps globally with zero-config infrastructure.',
    cta: 'Get Started',
    gradient: 'from-[#10b981]/10 to-[#f97316]/10',
    accent: '#10b981',
  },
];

interface AdSlotProps {
  variant?: 'card' | 'sidebar';
  index?: number;
}

export default function AdSlot({ variant = 'card', index = 0 }: AdSlotProps) {
  const ad = AD_CONTENTS[index % AD_CONTENTS.length];

  if (variant === 'sidebar') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-5 relative overflow-hidden"
      >
        {/* Sponsored badge */}
        <div className="absolute top-3 right-3">
          <span className="text-[10px] text-white/25 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
            Sponsored
          </span>
        </div>
        <Megaphone className="w-8 h-8 mb-3" style={{ color: ad.accent }} />
        <h4 className="text-sm font-semibold text-white mb-1">{ad.headline}</h4>
        <p className="text-xs text-white/40 mb-3 leading-relaxed">{ad.subtext}</p>
        <button
          className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
          style={{
            borderColor: `${ad.accent}40`,
            color: ad.accent,
            background: `${ad.accent}10`,
          }}
        >
          {ad.cta}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`glass-card overflow-hidden relative bg-gradient-to-br ${ad.gradient}`}
    >
      {/* Sponsored badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="text-[10px] text-white/25 uppercase tracking-widest bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
          Sponsored
        </span>
      </div>

      <div className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
        <Sparkles className="w-8 h-8 mb-3" style={{ color: ad.accent }} />
        <h4 className="text-base font-bold text-white mb-2">{ad.headline}</h4>
        <p className="text-sm text-white/40 mb-4 leading-relaxed">{ad.subtext}</p>
        <button
          className="text-sm font-medium px-4 py-2 rounded-lg border transition-all hover:opacity-80"
          style={{
            borderColor: `${ad.accent}40`,
            color: ad.accent,
            background: `${ad.accent}10`,
          }}
        >
          {ad.cta}
        </button>
      </div>

      {/* Decorative glow */}
      <div
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-[60px] pointer-events-none"
        style={{ background: ad.accent }}
      />
    </motion.div>
  );
}
