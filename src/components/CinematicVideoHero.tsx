'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Category-based video backgrounds (free stock video loops)
const CATEGORY_VIDEOS: Record<string, string> = {
  Tech: 'https://cdn.pixabay.com/video/2020/05/25/38619-424930032_large.mp4',
  Design: 'https://cdn.pixabay.com/video/2019/06/17/24633-342733811_large.mp4',
  Art: 'https://cdn.pixabay.com/video/2021/02/22/65895-516251685_large.mp4',
  Lifestyle: 'https://cdn.pixabay.com/video/2020/07/30/45309-445048954_large.mp4',
  Science: 'https://cdn.pixabay.com/video/2020/02/11/32468-392498620_large.mp4',
  Business: 'https://cdn.pixabay.com/video/2017/12/14/13369-247517027_large.mp4',
};

const DEFAULT_VIDEO = 'https://cdn.pixabay.com/video/2024/02/23/201843-915309699_large.mp4';

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

  // Parallax transforms
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

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
      style={{ minHeight: '70vh' }}
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

        {/* Multi-layer gradient overlays for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a14]/50 via-transparent to-[#0a0a14]/50" />
        <div className="absolute inset-0 bg-[#0a0a14]/30" />

        {/* Animated scanlines for cinematic feel */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          }}
        />
      </motion.div>

      {/* Video Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full glass-control flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full glass-control flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Hero Content Overlay */}
      <motion.div
        className="relative z-10 flex flex-col justify-end h-full min-h-[70vh] px-6 sm:px-10 lg:px-16 pb-16 pt-32"
        style={{ y: textY, opacity: textOpacity }}
      >
        {/* Category tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] glass-chip">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] mr-2 animate-pulse" />
            {category}
          </span>
        </motion.div>

        {/* Title with staggered letter reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight max-w-4xl"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-4 text-lg sm:text-xl text-white/50 max-w-2xl leading-relaxed font-light"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
          className="mt-6 h-px w-32 origin-left bg-gradient-to-r from-[#00f0ff] via-[#a855f7] to-transparent"
        />
      </motion.div>
    </motion.div>
  );
}
