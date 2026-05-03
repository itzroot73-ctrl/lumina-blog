'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Use the user-uploaded SpiderHeck video as the default
const DEFAULT_VIDEO = '/hero-bg.mp4';

// Category-based video backgrounds — all fallback to SpiderHeck video
const CATEGORY_VIDEOS: Record<string, string> = {
  Tech: DEFAULT_VIDEO,
  Design: DEFAULT_VIDEO,
  Art: DEFAULT_VIDEO,
  Lifestyle: DEFAULT_VIDEO,
  Science: DEFAULT_VIDEO,
  Business: DEFAULT_VIDEO,
};

interface CinematicVideoHeroProps {
  title: string;
  subtitle?: string;
  category?: string;
  thumbnail?: string;
  videoSrc?: string;
}

export default function CinematicVideoHero({
  title,
  subtitle,
  category = 'Tech',
  thumbnail,
  videoSrc,
}: CinematicVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms — SpiderHeck feel: deeper parallax
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  const selectedVideo = videoSrc || CATEGORY_VIDEOS[category] || DEFAULT_VIDEO;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '80vh' }}
    >
      {/* Video Background Layer */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: videoScale, opacity: videoOpacity }}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          poster={thumbnail || undefined}
        >
          <source src={selectedVideo} type="video/mp4" />
        </video>

        {/* Fallback thumbnail if video hasn't loaded */}
        {!videoLoaded && thumbnail && (
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* SpiderHeck-style multi-layer gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060610] via-[#060610]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060610]/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060610]/60 via-transparent to-[#060610]/60" />
        <div className="absolute inset-0 bg-[#060610]/40" />

        {/* Animated scanlines for cinematic SpiderHeck feel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
            opacity: 0.5,
          }}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Video Controls — SpiderHeck styled */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full glass-control flex items-center justify-center text-[#00f0ff]/60 hover:text-[#00f0ff] transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full glass-control flex items-center justify-center text-[#00f0ff]/60 hover:text-[#00f0ff] transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* SpiderHeck-style glowing accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent" />

      {/* Hero Content Overlay */}
      <motion.div
        className="relative z-10 flex flex-col justify-end h-full min-h-[80vh] px-6 sm:px-10 lg:px-16 pb-20 pt-40"
        style={{ y: textY, opacity: textOpacity }}
      >
        {/* Category tag — SpiderHeck neon chip */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-5"
        >
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-[0.25em] bg-[#00f0ff]/8 border border-[#00f0ff]/20 text-[#00f0ff]/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] mr-2.5 animate-pulse shadow-[0_0_6px_#00f0ff]" />
            {category}
          </span>
        </motion.div>

        {/* Title — bold cinematic SpiderHeck type */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight max-w-5xl"
          style={{ textShadow: '0 0 60px rgba(0,240,255,0.15)' }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-5 text-lg sm:text-xl text-white/40 max-w-2xl leading-relaxed font-light"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative line — SpiderHeck neon accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
          className="mt-8 h-[2px] w-40 origin-left bg-gradient-to-r from-[#00f0ff] via-[#a855f7] to-transparent"
          style={{ boxShadow: '0 0 8px rgba(0,240,255,0.4)' }}
        />
      </motion.div>
    </motion.div>
  );
}
