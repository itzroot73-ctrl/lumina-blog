'use client';

import { useAppStore, CATEGORIES, CATEGORY_COLORS, type SearchFilter } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Video, Zap, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const FILTER_OPTIONS: { key: SearchFilter; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All', icon: Search },
  { key: 'articles', label: 'Articles', icon: FileText },
  { key: 'videos', label: 'Videos', icon: Video },
  { key: 'sponsored', label: 'Most Sponsored', icon: Zap },
];

export default function SearchRipple() {
  const { searchFilter, setSearchFilter, loadPosts } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSearch = (value: string, filter?: SearchFilter) => {
    setQuery(value);
    const activeFilter = filter || searchFilter;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      let postType: string | undefined;
      if (activeFilter === 'articles') postType = 'article';
      else if (activeFilter === 'videos') postType = 'video';
      else if (activeFilter === 'sponsored') postType = 'sponsored';
      loadPosts(value || undefined, undefined, postType);
    }, 300);
  };

  const handleFilterChange = (filter: SearchFilter) => {
    setSearchFilter(filter);
    handleSearch(query, filter);
  };

  return (
    <>
      {/* Minimalist Orange Search Line */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-md group"
        whileHover={{ scaleX: 1.02 }}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#f97316]/30 to-transparent group-hover:via-[#f97316]/50 transition-all duration-500" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 flex items-center gap-2 text-white/25 group-hover:text-white/40 transition-colors">
          <Search className="w-3 h-3" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Search</span>
        </div>
      </motion.button>

      {/* Full-Screen Glassmorphic Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
          >
            {/* Backdrop with ripple darkening */}
            <motion.div
              initial={{ scale: 0, borderRadius: '50%' }}
              animate={{ scale: 50, borderRadius: '0%' }}
              exit={{ scale: 0, borderRadius: '50%' }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
              style={{ originX: '50%', originY: '35%' }}
            />

            {/* Search Content */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10 w-full max-w-2xl mx-4"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Search Input */}
              <div className="frosted-orange rounded-2xl p-1">
                <div className="flex items-center gap-3 px-5 py-4">
                  <Search className="w-5 h-5 text-[#f97316]/50 shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search articles, videos, creators..."
                    className="flex-1 bg-transparent text-white text-lg placeholder:text-white/20 outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => { setQuery(''); handleSearch(''); }}
                      className="text-white/30 hover:text-white/60 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 mt-4 justify-center">
                {FILTER_OPTIONS.map((opt) => {
                  const isActive = searchFilter === opt.key;
                  return (
                    <motion.button
                      key={opt.key}
                      onClick={() => handleFilterChange(opt.key)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/25'
                          : 'text-white/30 hover:text-white/50 bg-white/[0.03] border border-white/5'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <opt.icon className="w-3 h-3" />
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Quick Searches */}
              <div className="mt-8">
                <p className="text-xs text-white/15 uppercase tracking-[0.2em] mb-4">Trending</p>
                <div className="space-y-1">
                  {['Glassmorphism', 'WebSockets', 'TypeScript', 'Three.js', 'Framer Motion'].map((topic, i) => (
                    <motion.button
                      key={topic}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.06 }}
                      onClick={() => { setQuery(topic); handleSearch(topic); setIsOpen(false); }}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#f97316]/20 w-5">{i + 1}</span>
                        <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{topic}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-white/10 group-hover:text-[#f97316]/40 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
