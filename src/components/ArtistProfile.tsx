'use client';

import { useAppStore, type Post } from '@/lib/store';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  Eye,
  MapPin,
  Calendar,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function ProfilePostCard({ post, index, onNavigate }: { post: Post; index: number; onNavigate: (view: string, params: Record<string, string>) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      className="glass-card overflow-hidden cursor-pointer group"
      onClick={() => onNavigate('post', { id: post.id })}
    >
      {post.thumbnail && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#00f0ff] transition-colors">
          {post.title}
        </h4>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {post._count?.likes || 0}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ArtistProfile() {
  const { profileData, profileLoading, loadProfile, navigate, viewParams } = useAppStore();

  useEffect(() => {
    if (viewParams.username) {
      loadProfile(viewParams.username);
    }
  }, [viewParams.username, loadProfile]);

  if (profileLoading || !profileData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-12 animate-pulse">
          <div className="w-24 h-24 bg-white/5 rounded-full mx-auto mb-4" />
          <div className="h-6 bg-white/5 rounded w-48 mx-auto mb-2" />
          <div className="h-4 bg-white/5 rounded w-32 mx-auto" />
        </div>
      </div>
    );
  }

  const { user, stats, posts } = profileData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cover Gradient */}
        <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/20 via-[#a855f7]/10 to-[#10b981]/20" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(0,240,255,0.15) 0%, transparent 50%),
                             radial-gradient(circle at 70% 50%, rgba(168,85,247,0.15) 0%, transparent 50%)`,
          }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-start gap-6 -mt-16 relative z-10 px-4 sm:px-6">
          <Avatar className="h-28 w-28 border-4 border-[#0a0a14] shadow-lg">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-[#00f0ff]/30 to-[#a855f7]/30 text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 pt-2 sm:pt-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-[#00f0ff] text-sm">@{user.username}</p>
            {user.bio && (
              <p className="text-white/50 text-sm mt-3 max-w-xl leading-relaxed">{user.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-white/30">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              {user.role === 'artist' && (
                <Badge className="bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/20 text-xs">
                  Artist
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 text-center"
          >
            <FileText className="w-5 h-5 text-[#00f0ff] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter target={stats.totalPosts} />
            </p>
            <p className="text-xs text-white/40 mt-1">Posts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 text-center glow-cyan"
          >
            <Eye className="w-5 h-5 text-[#a855f7] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter target={stats.totalViews} />
            </p>
            <p className="text-xs text-white/40 mt-1">Total Views</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 text-center"
          >
            <Heart className="w-5 h-5 text-[#10b981] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter target={stats.totalLikes} />
            </p>
            <p className="text-xs text-white/40 mt-1">Total Likes</p>
          </motion.div>
        </div>

        {/* Posts Section */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#a855f7]" />
            Published Works
          </h2>

          {posts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <FileText className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30">No published posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, index) => (
                <ProfilePostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onNavigate={navigate}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
