'use client';

import { useAppStore, type Post, CATEGORIES, CATEGORY_COLORS, type Category } from '@/lib/store';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Clock, Eye, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback, useRef } from 'react';
import AdSlot from './AdSlot';

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

  // Insert ad slots between every 4-5 posts
  const renderPostsWithAds = () => {
    const elements: React.ReactNode[] = [];
    posts.forEach((post, index) => {
      elements.push(
        <PostCard key={post.id} post={post} index={index} />
      );
      // Insert ad after every 4th post (but not after the last one)
      if (!isPremium && (index + 1) % 4 === 0 && index < posts.length - 1) {
        elements.push(
          <AdSlot key={`ad-${index}`} variant="card" index={Math.floor(index / 4)} />
        );
      }
    });
    return elements;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 pt-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/5 border border-[#00f0ff]/10 mb-4"
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="text-xs text-[#00f0ff]/70 font-medium">Trending articles from top creators</span>
        </motion.div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
          <span className="gradient-text">Discover Stories</span>
        </h1>
        <p className="text-lg text-white/45 max-w-2xl mx-auto leading-relaxed">
          Where artists share their craft. Explore insights on design, development,
          and creative technology.
        </p>
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
            {/* Sidebar Ad */}
            <AdSlot variant="sidebar" index={0} />

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

            {/* Sidebar Ad 2 */}
            <AdSlot variant="sidebar" index={1} />
          </motion.aside>
        )}
      </div>
    </div>
  );
}
