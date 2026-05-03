'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, User, Calendar, Tag, Eye, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProjectInfoGridProps {
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  publishDate: string;
  readingTime: number;
  category: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  onAuthorClick: () => void;
}

const gridItems = [
  { key: 'publisher', label: 'PUBLISHER', icon: User },
  { key: 'date', label: 'PUBLISH DATE', icon: Calendar },
  { key: 'readTime', label: 'EST. READ TIME', icon: Clock },
  { key: 'category', label: 'CATEGORY', icon: Tag },
  { key: 'views', label: 'VIEWS', icon: Eye },
  { key: 'engagement', label: 'ENGAGEMENT', icon: BookOpen },
];

export default function ProjectInfoGrid({
  authorName,
  authorUsername,
  authorAvatar,
  publishDate,
  readingTime,
  category,
  views,
  likesCount,
  commentsCount,
  onAuthorClick,
}: ProjectInfoGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const infoData: Record<string, React.ReactNode> = {
    publisher: (
      <button onClick={onAuthorClick} className="flex items-center gap-2.5 group">
        <Avatar className="h-8 w-8 border border-white/8 group-hover:border-[#00f0ff]/25 transition-colors">
          <AvatarImage src={authorAvatar || undefined} alt={authorName} />
          <AvatarFallback className="bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 text-white text-xs">
            {authorName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="text-sm font-semibold text-white group-hover:text-[#00f0ff] transition-colors">{authorName}</p>
          <p className="text-[10px] text-white/25">@{authorUsername}</p>
        </div>
      </button>
    ),
    date: (
      <p className="text-sm font-semibold text-white">
        {new Date(publishDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>
    ),
    readTime: (
      <p className="text-sm font-semibold text-white">
        {readingTime} <span className="text-white/30 font-normal">min</span>
      </p>
    ),
    category: (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#00f0ff]/8 text-[#00f0ff] border border-[#00f0ff]/15">
        {category}
      </span>
    ),
    views: (
      <p className="text-sm font-semibold text-white">
        {views.toLocaleString()} <span className="text-white/30 font-normal">reads</span>
      </p>
    ),
    engagement: (
      <p className="text-sm font-semibold text-white">
        {likesCount} <span className="text-white/30 font-normal">likes</span>
        <span className="text-white/15 mx-1.5">/</span>
        {commentsCount} <span className="text-white/30 font-normal">comments</span>
      </p>
    ),
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full"
    >
      {/* Section label — SpiderHeck neon accent */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-4"
      >
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/25 flex items-center gap-2">
          <span className="w-6 h-px bg-[#00f0ff]/30" />
          Story Info
        </h3>
      </motion.div>

      {/* Grid — SpiderHeck glass info cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {gridItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
            className="glass-info-card p-4"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <item.icon className="w-3 h-3 text-[#00f0ff]/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">
                {item.label}
              </span>
            </div>
            {infoData[item.key]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
