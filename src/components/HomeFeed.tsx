'use client';

import { useAppStore, type Post, CATEGORIES, CATEGORY_COLORS, type Category } from '@/lib/store';
import { motion, AnimatePresence, LayoutGroup, useInView } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Clock, Eye, Search, Sparkles, TrendingUp, ChevronRight, Play, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleAdInFeed, GoogleAdSidebar } from './ads';

const HERO_VIDEO_URL = '/hero-bg.mp4';

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Tech;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm"
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {category}
    </span>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const { navigate, user, setShowDonationModal, setDonationPostId } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDonationPostId(post.id);
    setShowDonationModal(true);
  };

  // Play video on hover
  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (!isHovered && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.div
      ref={ref}
      layout
      layoutId={`post-${post.id}`}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="glass-card overflow-hidden cursor-pointer group"
      onClick={() => navigate('post', { id: post.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail — 16:9 aspect ratio with video preview */}
      {post.thumbnail && (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {/* Static image */}
          <img
            src={post.thumbnail}
            alt={post.title}
            className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-0 scale-105' : 'opacity-100'}`}
            loading="lazy"
          />

          {/* Video preview on hover */}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            poster={post.thumbnail}
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />

          {/* Play icon on hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-12 h-12 rounded-full bg-[#f97316]/20 backdrop-blur-sm border border-[#f97316]/30 flex items-center justify-center">
              <Play className="w-5 h-5 text-[#f97316] fill-[#f97316]" />
            </div>
          </div>

          {/* Category Badge on thumbnail */}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={post.category} />
          </div>

          {/* Reading time badge */}
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className="bg-[#0a0a0a]/60 backdrop-blur-sm text-white/80 border-white/10 text-xs"
            >
              <Clock className="w-3 h-3 mr-1" />
              {post.readingTime} min read
            </Badge>
          </div>

          {/* Hover arrow indicator */}
          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#f97316]/10 backdrop-blur-sm border border-[#f97316]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <ChevronRight className="w-4 h-4 text-[#f97316]" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-[#f97316] transition-colors leading-snug">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-white/35 mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Author & Stats */}
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2 group/author"
            onClick={(e) => {
              e.stopPropagation();
              navigate('profile', { username: post.author.username });
            }}
          >
            <Avatar className="h-7 w-7 border border-white/10">
              <AvatarImage src={post.author.avatar || undefined} alt={post.author.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-xs">
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-white/40 group-hover/author:text-[#f97316]/70 transition-colors">
              {post.author.name}
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-3 text-xs text-white/25">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {post._count?.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.views}
              </span>
            </div>
            {/* Support button on card */}
            <button
              onClick={handleSupport}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-[10px] font-bold hover:bg-[#f97316]/20"
            >
              <DollarSign className="w-3 h-3" />
              Support
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NoResultsCard({ searchQuery }: { searchQuery: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
      className="glass-card p-12 text-center col-span-full"
    >
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#f97316]/10 to-[#f59e0b]/10 border border-[#f97316]/10 flex items-center justify-center"
      >
        <Search className="w-8 h-8 text-[#f97316]/20" />
      </motion.div>
      <h3 className="text-xl font-bold text-white/60 mb-2">No results found</h3>
      <p className="text-white/30 text-sm mb-1">We couldn&apos;t find anything matching</p>
      <p className="text-[#f97316]/60 text-sm font-medium mb-6">&ldquo;{searchQuery}&rdquo;</p>
      <p className="text-white/20 text-xs">Try adjusting your search or explore different categories</p>
    </motion.div>
  );
}

export default function HomeFeed() {
  const { posts, postsLoading, loadPosts, navigate, user } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        loadPosts(value || undefined, activeCategory);
      }, 300);
    },
    [loadPosts, activeCategory]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    loadPosts(search || undefined, cat);
  };

  const isPremium = user?.isPremium ?? false;

  const renderPostsWithAds = () => {
    const elements: React.ReactNode[] = [];
    posts.forEach((post, index) => {
      elements.push(
        <PostCard key={post.id} post={post} index={index} />
      );
      if (!isPremium && (index + 1) % 4 === 0 && index < posts.length - 1) {
        elements.push(
          <GoogleAdInFeed key={`ad-infeed-${index}`} index={Math.floor(index / 4)} />
        );
      }
    });
    return elements;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ====== CINEMATIC HERO SECTION WITH VIDEO ====== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative w-full overflow-hidden rounded-2xl mb-14"
        style={{ minHeight: '55vh' }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/40" />
        <div className="absolute inset-0 bg-[#0a0a0a]/30" />

        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
            opacity: 0.6,
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-[#f97316]/25 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-end h-full min-h-[55vh] px-6 sm:px-10 lg:px-16 pb-12 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md w-fit mb-5 bg-[#f97316]/6 border border-[#f97316]/15"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#f97316]" />
            <span className="text-xs text-[#f97316]/70 font-medium tracking-wide">Trending articles from top creators</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 tracking-tight leading-[0.95]"
            style={{ textShadow: '0 0 60px rgba(249,115,22,0.12)' }}
          >
            <span className="gradient-text">Discover</span>
            <br />
            <span className="text-white/90">Stories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base sm:text-lg text-white/35 max-w-xl leading-relaxed"
          >
            Where artists share their craft. Explore insights on design, development,
            and creative technology.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            className="mt-6 h-[2px] w-32 origin-left bg-gradient-to-r from-[#f97316] via-[#f59e0b] to-transparent"
            style={{ boxShadow: '0 0 8px rgba(249,115,22,0.3)' }}
          />
        </div>
      </motion.div>

      {/* ====== FROSTED ORANGE GLASS SEARCH BAR ====== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-2xl mx-auto mb-8"
      >
        <div className="frosted-orange-input rounded-2xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f97316]/40" />
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search articles, topics, authors..."
            className="bg-transparent border-0 pl-12 h-14 text-white placeholder:text-white/25 text-sm rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                loadPosts(undefined, activeCategory);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#f97316]/60 text-xs transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Category Filter — Orange neon chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-2 mb-12 flex-wrap"
      >
        {CATEGORIES.map((cat, i) => {
          const colors = CATEGORY_COLORS[cat];
          const isActive = activeCategory === cat;
          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-white/30 hover:text-white/50 bg-white/[0.02] border border-white/5 hover:border-white/10'
              }`}
              style={
                isActive && colors
                  ? {
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                      boxShadow: `0 0 12px ${colors.border}, inset 0 0 12px ${colors.bg}`,
                    }
                  : isActive
                  ? {
                      background: 'rgba(249,115,22,0.1)',
                      border: '1px solid rgba(249,115,22,0.3)',
                      color: '#f97316',
                      boxShadow: '0 0 12px rgba(249,115,22,0.15), inset 0 0 12px rgba(249,115,22,0.05)',
                    }
                  : undefined
              }
            >
              {cat}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Main content area with sidebar */}
      <div className="flex gap-8">
        {/* Posts Grid */}
        <div className="flex-1 min-w-0">
          <LayoutGroup>
            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <div className="w-full animate-pulse" style={{ aspectRatio: '16/9' }}>
                      <div className="w-full h-full bg-white/5" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-white/5 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                      <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 && search ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NoResultsCard searchQuery={search} />
              </div>
            ) : posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#f97316]/10 to-[#f59e0b]/10 border border-[#f97316]/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#f97316]/20" />
                </div>
                <p className="text-white/40 text-lg font-medium">No articles yet</p>
                <p className="text-white/20 text-sm mt-2">Be the first to share your story</p>
                <button
                  onClick={() => navigate('register')}
                  className="mt-4 text-[#f97316] hover:underline text-sm"
                >
                  Sign up as an artist →
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {renderPostsWithAds()}
                </AnimatePresence>
              </motion.div>
            )}
          </LayoutGroup>
        </div>

        {/* Sidebar — only visible on large screens, hidden for premium */}
        {!isPremium && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden xl:block w-72 shrink-0 space-y-6"
          >
            <GoogleAdSidebar />

            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
                Trending Topics
              </h3>
              <div className="space-y-1.5">
                {['Glassmorphism', 'WebSockets', 'TypeScript', 'Framer Motion', 'Edge Computing'].map(
                  (topic, i) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setSearch(topic);
                        loadPosts(topic, activeCategory);
                      }}
                      className="flex items-center gap-2.5 w-full text-left p-2.5 rounded-lg hover:bg-[#f97316]/5 transition-colors group"
                    >
                      <span className="text-[10px] font-bold text-[#f97316]/20 w-5 tabular-nums">{i + 1}</span>
                      <span className="text-sm text-white/40 group-hover:text-[#f97316]/70 transition-colors">
                        {topic}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <GoogleAdSidebar className="mt-6" />
          </motion.aside>
        )}
      </div>
    </div>
  );
}
