'use client';

import { useAppStore, type Post, CATEGORIES, CATEGORY_COLORS, type Category } from '@/lib/store';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Clock, Eye, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleAdInFeed, GoogleAdSidebar } from './ads';

// Cinematic hero video for the home feed
const HERO_VIDEO_URL = 'https://cdn.pixabay.com/video/2024/02/23/201843-915309699_large.mp4';

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
  const { navigate } = useAppStore();

  return (
    <motion.div
      layout
      layoutId={`post-${post.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card overflow-hidden cursor-pointer group"
      onClick={() => navigate('post', { id: post.id })}
    >
      {/* Thumbnail — 16:9 aspect ratio */}
      {post.thumbnail && (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Category Badge on thumbnail */}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={post.category} />
          </div>

          {/* Reading time badge */}
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className="bg-black/40 backdrop-blur-sm text-white/80 border-white/10 text-xs"
            >
              <Clock className="w-3 h-3 mr-1" />
              {post.readingTime} min read
            </Badge>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-[#00f0ff] transition-colors leading-snug">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-white/45 mb-4 line-clamp-2 leading-relaxed">
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
              <AvatarFallback className="bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 text-white text-xs">
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-white/50 group-hover/author:text-white/70 transition-colors">
              {post.author.name}
            </span>
          </button>

          <div className="flex items-center gap-3 text-xs text-white/35">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {post._count?.likes || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {post._count?.comments || 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views}
            </span>
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
        animate={{
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00f0ff]/10 to-[#a855f7]/10 border border-white/10 flex items-center justify-center"
      >
        <Search className="w-8 h-8 text-white/20" />
      </motion.div>
      <h3 className="text-xl font-bold text-white/60 mb-2">No results found</h3>
      <p className="text-white/30 text-sm mb-1">
        We couldn&apos;t find anything matching
      </p>
      <p className="text-[#00f0ff]/60 text-sm font-medium mb-6">
        &ldquo;{searchQuery}&rdquo;
      </p>
      <p className="text-white/20 text-xs">
        Try adjusting your search or explore different categories
      </p>
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

  // Debounced search
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

  // Insert Google In-Feed ad slots between every 4-5 posts
  const renderPostsWithAds = () => {
    const elements: React.ReactNode[] = [];
    posts.forEach((post, index) => {
      elements.push(
        <PostCard key={post.id} post={post} index={index} />
      );
      // Insert Google In-Feed ad after every 4th post (but not after the last one)
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
      {/* Cinematic Hero Section with Video Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full overflow-hidden rounded-2xl mb-12"
        style={{ minHeight: '45vh' }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14]/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[#0a0a14]/20" />

        {/* Scanlines */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-end h-full min-h-[45vh] px-6 sm:px-10 lg:px-16 pb-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-chip w-fit mb-4"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="text-xs text-[#00f0ff]/70 font-medium">Trending articles from top creators</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 tracking-tight"
          >
            <span className="gradient-text">Discover Stories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg text-white/45 max-w-xl leading-relaxed"
          >
            Where artists share their craft. Explore insights on design, development,
            and creative technology.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
            className="mt-5 h-px w-24 origin-left bg-gradient-to-r from-[#00f0ff] via-[#a855f7] to-transparent"
          />
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-xl mx-auto mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search articles, topics, authors..."
            className="glass-input pl-11 h-12 text-white placeholder:text-white/25 text-sm rounded-xl"
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                loadPosts(undefined, activeCategory);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-2 mb-10 flex-wrap"
      >
        {CATEGORIES.map((cat) => {
          const colors = CATEGORY_COLORS[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-white/40 hover:text-white/60 bg-white/[0.03] border border-white/5 hover:border-white/10'
              }`}
              style={
                isActive && colors
                  ? {
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                      boxShadow: `0 0 12px ${colors.border}`,
                    }
                  : isActive
                  ? {
                      background: 'rgba(0,240,255,0.1)',
                      border: '1px solid rgba(0,240,255,0.3)',
                      color: '#00f0ff',
                      boxShadow: '0 0 12px rgba(0,240,255,0.15)',
                    }
                  : undefined
              }
            >
              {cat}
            </button>
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
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00f0ff]/10 to-[#a855f7]/10 border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-white/40 text-lg font-medium">No articles yet</p>
                <p className="text-white/25 text-sm mt-2">
                  Be the first to share your story
                </p>
                <button
                  onClick={() => navigate('register')}
                  className="mt-4 text-[#00f0ff] hover:underline text-sm"
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
            {/* Google Sidebar Display Ad */}
            <GoogleAdSidebar />

            {/* Trending Topics */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#a855f7]" />
                Trending Topics
              </h3>
              <div className="space-y-2">
                {['Glassmorphism', 'WebSockets', 'TypeScript', 'Framer Motion', 'Edge Computing'].map(
                  (topic, i) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setSearch(topic);
                        loadPosts(topic, activeCategory);
                      }}
                      className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-xs font-bold text-white/20 w-5">{i + 1}</span>
                      <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                        {topic}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Second Sidebar Ad */}
            <GoogleAdSidebar className="mt-6" />
          </motion.aside>
        )}
      </div>
    </div>
  );
}
