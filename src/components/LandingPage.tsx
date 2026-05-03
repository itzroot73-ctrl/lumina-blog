'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, PenSquare, BookOpen, Shield } from 'lucide-react';

const FEATURES = [
  { icon: PenSquare, label: 'Create & Publish', desc: 'Share your stories with the world' },
  { icon: BookOpen, label: 'Discover Content', desc: 'Explore articles from top creators' },
  { icon: Shield, label: 'Support Artists', desc: '80% goes directly to creators' },
];

export default function LandingPage() {
  const { navigate } = useAppStore();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-Screen Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Multi-layer dark overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]/50" />

      {/* Animated scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
          opacity: 0.5,
        }}
      />

      {/* Radial orange glow behind logo */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-[#f97316]/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Massive "Lumina" Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-5 mb-2">
            {/* Orange glow logo mark */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-2xl"
              style={{ boxShadow: '0 0 60px rgba(249,115,22,0.4), 0 0 120px rgba(249,115,22,0.15)' }}
            >
              <span className="text-white text-3xl sm:text-4xl font-black">L</span>
            </motion.div>

            {/* Lumina text */}
            <motion.h1
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter"
              style={{ textShadow: '0 0 80px rgba(249,115,22,0.3)' }}
            >
              <span className="text-[#f97316]">Lum</span>
              <span className="text-white/90">ina</span>
            </motion.h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-lg sm:text-xl text-white/30 font-light tracking-wide max-w-lg mx-auto"
          >
            Where creators shine. Stories that illuminate.
          </motion.p>
        </motion.div>

        {/* Glowing Sign In Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-8"
        >
          <Button
            onClick={() => navigate('login')}
            className="group relative h-14 px-10 text-lg font-bold rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#fb923c] hover:to-[#f97316] text-white border-0 transition-all duration-300 overflow-hidden"
            style={{
              boxShadow: '0 0 30px rgba(249,115,22,0.4), 0 0 60px rgba(249,115,22,0.15), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            {/* Glow pulse effect */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f97316] to-[#f59e0b] opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-pulse" />
            <span className="relative flex items-center gap-2">
              Sign In to Explore
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </motion.div>

        {/* Secondary actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-6 flex items-center gap-6"
        >
          <button
            onClick={() => navigate('register')}
            className="text-sm text-white/40 hover:text-[#f97316]/80 transition-colors font-medium"
          >
            Create Account
          </button>
          <span className="text-white/10">|</span>
          <button
            onClick={() => navigate('browse')}
            className="text-sm text-white/40 hover:text-white/60 transition-colors font-medium"
          >
            Browse as Guest
          </button>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + i * 0.15, duration: 0.5 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
            >
              <feature.icon className="w-4 h-4 text-[#f97316]/60" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white/70">{feature.label}</p>
                <p className="text-[10px] text-white/25">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decorative gradient line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 1.5, ease: 'easeOut' }}
          className="mt-12 h-[2px] w-48 origin-left bg-gradient-to-r from-[#f97316] via-[#f59e0b] to-transparent"
          style={{ boxShadow: '0 0 10px rgba(249,115,22,0.4)' }}
        />
      </div>
    </div>
  );
}
