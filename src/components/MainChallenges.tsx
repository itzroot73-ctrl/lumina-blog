'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface MainChallengesProps {
  excerpt: string;
  challenges?: string[];
}

export default function MainChallenges({ excerpt, challenges }: MainChallengesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Parse challenges from excerpt or use provided ones
  const parsedChallenges = challenges || extractChallenges(excerpt);

  if (parsedChallenges.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full"
    >
      {/* Section Header — SpiderHeck purple accent */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-5"
      >
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/25 flex items-center gap-2">
          <span className="w-6 h-px bg-[#a855f7]/30" />
          Main Challenges
        </h3>
      </motion.div>

      {/* Challenges List — SpiderHeck glass */}
      <div className="glass-challenges-card p-5 sm:p-6 space-y-3">
        {parsedChallenges.map((challenge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -15 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
            className="flex items-start gap-3 group"
          >
            {/* Bullet indicator — SpiderHeck neon dot */}
            <div className="shrink-0 mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] group-hover:bg-[#00f0ff] transition-colors shadow-[0_0_4px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_4px_rgba(0,240,255,0.5)]" />
              <span className="text-[10px] font-bold text-white/10 tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Challenge text */}
            <p className="text-sm sm:text-base text-white/60 leading-relaxed group-hover:text-white/85 transition-colors">
              {challenge}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Extracts bullet-point-like challenges from a text excerpt.
 * Looks for sentences that contain keywords like "exploring", "understanding",
 * "building", "navigating", or sentences that end with a colon.
 * Falls back to splitting by period if no keywords found.
 */
function extractChallenges(text: string): string[] {
  if (!text) return [];

  // Try splitting by numbered items, bullet points, or semicolons
  const bulletSplit = text.split(/[;•·]|(?=\d+\.\s)/).map(s => s.trim()).filter(Boolean);
  if (bulletSplit.length > 1) return bulletSplit.slice(0, 5);

  // Try splitting by sentences
  const sentenceSplit = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  if (sentenceSplit.length > 1) return sentenceSplit.slice(0, 5);

  // Fallback: just return the whole excerpt as one challenge
  return [text];
}
