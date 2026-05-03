'use client';

import { useAppStore, type Post } from '@/lib/store';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Clock, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

function PostCard({ post, index }: { post: Post; index: number }) {
  const { navigate } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="glass-card overflow-hidden cursor-pointer group"
      onClick={() => navigate('post', { id: post.id })}
    >
      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#00f0ff] transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-white/50 mb-4 line-clamp-2">
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

          <div className="flex items-center gap-3 text-xs text-white/40">
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

export default function HomeFeed() {
  const { posts, postsLoading, loadPosts, navigate } = useAppStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPosts(search);
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
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Discover Stories</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto">
          Where artists share their craft. Explore insights on design, development,
          and creative technology.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSearch}
        className="max-w-xl mx-auto mb-10"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="glass-input pl-10 h-11 text-white placeholder:text-white/30"
          />
        </div>
      </motion.form>

      {/* Posts Grid */}
      {postsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="h-48 bg-white/5 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-white/5 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-white/40 text-lg">No articles found</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
