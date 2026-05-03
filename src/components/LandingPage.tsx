'use client';

import { useAppStore } from '@/lib/store';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, PenSquare, Shield, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FEATURES = [
  { icon: PenSquare, label: 'Create & Publish', desc: 'Share your stories with the world through articles and videos' },
  { icon: BookOpen, label: 'Discover Content', desc: 'Explore curated content from top creators across every genre' },
  { icon: Shield, label: 'Support Artists', desc: '80% of your donation goes directly to the creator you love' },
];

const STATS = [
  { value: '10,000+', label: 'Active Creators' },
  { value: '50K+', label: 'Stories Published' },
  { value: '$2.4M', label: 'Creator Earnings' },
];

function FloatingGlassCard({ post, index, isMobile }: { post: { title: string; author: string; category: string }; index: number; isMobile: boolean }) {
  // On mobile, hide floating cards to avoid clutter
  if (isMobile) return null;

  const depth = 0.3 + index * 0.15;
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 + index * 20, rotateX: -10 + index * 3 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.2, delay: 2.5 + index * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute pointer-events-none"
      style={{
        top: `${18 + index * 22}%`,
        left: index % 2 === 0 ? `${5 + index * 8}%` : `${55 + index * 3}%`,
        transform: `translateZ(${depth * 100}px)`,
        zIndex: 10 + index,
      }}
    >
      <motion.div
        animate={{
          y: [0, -12 - index * 4, 0],
          rotateY: [0, index % 2 === 0 ? 3 : -3, 0],
          rotateX: [0, index % 2 === 0 ? -2 : 2, 0],
        }}
        transition={{ duration: 6 + index * 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
        className="glass-card px-5 py-4 w-64"
        style={{
          backdropFilter: 'blur(30px) saturate(1.6)',
          border: '1px solid rgba(249,115,22,0.12)',
          background: 'rgba(10,10,10,0.55)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 20px rgba(249,115,22,0.04)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#f97316]/60">{post.category}</span>
        </div>
        <p className="text-sm font-semibold text-white/80 line-clamp-2 leading-snug">{post.title}</p>
        <p className="text-xs text-white/30 mt-2">by {post.author}</p>
      </motion.div>
    </motion.div>
  );
}

function LiquidCTAButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      {/* SVG Filter for liquid metal effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquid-metal">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              seed="2"
              result="turbulence"
            >
              <animate
                attributeName="baseFrequency"
                values="0.015;0.035;0.015"
                dur="3s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={isHovered ? 12 : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative h-12 sm:h-16 px-6 sm:px-12 text-sm sm:text-lg font-bold rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white border-0 cursor-pointer overflow-hidden"
        style={{
          filter: isHovered ? 'url(#liquid-metal)' : 'none',
          boxShadow: '0 0 40px rgba(249,115,22,0.35), 0 0 80px rgba(249,115,22,0.12), 0 8px 30px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.4s ease',
        }}
        whileHover={{
          boxShadow: '0 0 60px rgba(249,115,22,0.5), 0 0 120px rgba(249,115,22,0.2), 0 12px 40px rgba(0,0,0,0.5)',
        }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Inner glow layer */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#fb923c] to-[#f97316] opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

        {/* Shimmer effect */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, transparent 50%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: isHovered ? '120% 0%' : '-20% 0%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        <span className="relative flex items-center gap-2 sm:gap-3">
          <span className="tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm font-black">Enter the Lumina</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
        </span>
      </motion.button>
    </div>
  );
}

export default function LandingPage() {
  const { navigate } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const luminaRef = useRef<HTMLHeadingElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const letterSpacing = useTransform(scrollYProgress, [0, 0.25], [0, isMobile ? 12 : 40]);
  const taglineOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // GSAP scroll animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Stats counter animation
      gsap.fromTo('.stat-item', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 85%',
          once: true,
        }}
      );

      // Feature cards stagger
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
          once: true,
        }}
      );

      // Parallax depth for floating cards (desktop only)
      if (!isMobile) {
        gsap.to('.floating-card-layer', {
          y: -60,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  const floatingPosts = [
    { title: 'The Art of Glassmorphism in Modern Web Design', author: 'Luna Chen', category: 'Design' },
    { title: 'Building Real-Time Applications with WebSockets', author: 'Kai Nakamura', category: 'Tech' },
    { title: 'Neon Aesthetics: Designing for the Digital Frontier', author: 'Aria Patel', category: 'Art' },
  ];

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${isMobile ? 'min-h-[200vh]' : 'min-h-[300vh]'}`}>
      {/* ====== HERO SECTION (Pinned) ====== */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Video Background — Slow abstract ink in water */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(1.2) contrast(1.1)' }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Multi-layer dark overlays for depth */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/60" />

        {/* Scanlines for cinematic texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
            opacity: 0.6,
          }}
        />

        {/* Radial orange glow behind LUMINA text */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
            style={{ width: isMobile ? '400px' : '900px', height: isMobile ? '400px' : '900px', background: 'radial-gradient(circle, #f97316 0%, transparent 60%)' }}
          />
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-[#f97316]/25 to-transparent" />

        {/* Floating Glass Cards in 3D space (desktop only) */}
        {!isMobile && (
          <div className="floating-card-layer absolute inset-0 pointer-events-none">
            {floatingPosts.map((post, i) => (
              <FloatingGlassCard key={i} post={post} index={i} isMobile={false} />
            ))}
          </div>
        )}

        {/* ====== MAIN HERO CONTENT ====== */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center">
          {/* LUMINA Typography — Letter spacing expands on scroll */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-4 sm:mb-6"
          >
            <motion.h1
              ref={luminaRef}
              style={{ letterSpacing }}
              className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-black tracking-tight leading-none select-none"
            >
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#f59e0b]"
                style={{ textShadow: '0 0 100px rgba(249,115,22,0.25)' }}
              >
                LUMINA
              </span>
            </motion.h1>
          </motion.div>

          {/* Tagline — fades on scroll */}
          <motion.p
            style={{ opacity: taglineOpacity }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-sm sm:text-lg text-white/30 font-light tracking-[0.1em] sm:tracking-[0.15em] max-w-xs sm:max-w-xl mx-auto mb-6 sm:mb-10 uppercase"
          >
            Where creators shine. Stories that illuminate.
          </motion.p>

          {/* Liquid CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <LiquidCTAButton onClick={() => navigate('login')} />
          </motion.div>

          {/* Secondary actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-4 sm:mt-6 flex items-center gap-4 sm:gap-6"
          >
            <button
              onClick={() => navigate('register')}
              className="text-xs sm:text-sm text-white/40 hover:text-[#f97316]/80 transition-colors font-medium tracking-wide"
            >
              Create Account
            </button>
            <span className="text-white/10">|</span>
            <button
              onClick={() => navigate('browse')}
              className="text-xs sm:text-sm text-white/40 hover:text-white/60 transition-colors font-medium tracking-wide"
            >
              Browse as Guest
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] text-white/15 uppercase tracking-[0.3em]">Scroll</span>
              <ChevronDown className="w-4 h-4 text-[#f97316]/30" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* ====== SPLIT-SCREEN SPIDERHECK SECTION ====== */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2 }}
        className="relative bg-[#0a0a0a]"
      >
        {/* Vertical Wipe Transition Bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f97316]/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
          {/* Section Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 flex items-center gap-3">
              <span className="w-8 h-px bg-[#f97316]/30" />
              Featured Story
            </h3>
          </motion.div>

          {/* Split Layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* LEFT: Featured Video Preview */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:w-[58%] relative"
            >
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{ minHeight: isMobile ? '40vh' : '60vh' }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/hero-bg.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[#0a0a0a]/20" />

                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
                    opacity: 0.5,
                  }}
                />

                {/* Sponsored Badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      background: 'rgba(249,115,22,0.12)',
                      border: '1px solid rgba(249,115,22,0.25)',
                      color: '#f97316',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
                    Sponsored
                  </span>
                </div>

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#f97316]/15 backdrop-blur-sm border border-[#f97316]/25 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-b-[8px] sm:border-b-[10px] border-b-transparent border-l-[12px] sm:border-l-[16px] border-l-[#f97316] ml-0.5 sm:ml-1" />
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-[#f97316]/30 to-transparent" />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-8">
                  <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316]/80 mb-2 sm:mb-3">
                    Featured
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight" style={{ textShadow: '0 0 40px rgba(249,115,22,0.15)' }}>
                    The Art of Glassmorphism
                  </h2>
                  <p className="text-sm sm:text-base text-white/35 mt-1 sm:mt-2 max-w-lg">Exploring how frosted glass effects are transforming digital interfaces and creating depth in flat design.</p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: Story Info Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:w-[42%] flex flex-col justify-center gap-3 sm:gap-4"
            >
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { label: 'AUTHOR', value: 'Luna Chen', sub: '@lunachen' },
                  { label: 'PUBLISHED', value: 'Mar 2026' },
                  { label: 'READ TIME', value: '6 min' },
                  { label: 'VIEWS', value: '1,247' },
                  { label: 'TOTAL DONATED', value: '$48.50', highlight: true },
                  { label: 'SPONSORED', value: '24h left', accent: true },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.08, duration: 0.5 }}
                    className="glass-info-card p-3 sm:p-4"
                  >
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 block mb-1.5 sm:mb-2">
                      {item.label}
                    </span>
                    <p className={`text-xs sm:text-sm font-semibold ${item.highlight ? 'text-[#10b981]' : item.accent ? 'text-[#f97316]' : 'text-white'}`}>
                      {item.value}
                    </p>
                    {item.sub && <p className="text-[9px] sm:text-[10px] text-white/25 mt-0.5">{item.sub}</p>}
                  </motion.div>
                ))}
              </div>

              {/* Donation transparency note */}
              <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-[#f97316]/5 border border-[#f97316]/10 mt-1 sm:mt-2">
                <Shield className="w-3.5 h-3.5 text-[#f97316]/40 shrink-0 mt-0.5" />
                <p className="text-[10px] sm:text-[11px] text-white/25 leading-relaxed">
                  80% of your support goes directly to the creator. 20% helps keep Lumina free for everyone.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ====== STATS SECTION ====== */}
      <div className="stats-section py-12 sm:py-20 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <p className="text-2xl sm:text-4xl md:text-5xl font-black text-[#f97316] mb-1 sm:mb-2" style={{ textShadow: '0 0 30px rgba(249,115,22,0.2)' }}>
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-sm text-white/30 uppercase tracking-[0.1em] sm:tracking-[0.15em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== FEATURES SECTION ====== */}
      <div className="features-section py-16 sm:py-24 bg-[#0a0a0a] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white text-center mb-10 sm:mb-16"
          >
            Built for <span className="text-[#f97316]">Creators</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="glass-card p-6 sm:p-8 h-full text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#f97316]/10 to-[#f59e0b]/10 border border-[#f97316]/10 flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#f97316]/60" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{feature.label}</h3>
                  <p className="text-xs sm:text-sm text-white/35 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
