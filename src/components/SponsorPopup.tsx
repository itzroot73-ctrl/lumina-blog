'use client';

import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, DollarSign, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SponsorPopup() {
  const { isAuthenticated, navigate, setShowDonationModal, setDonationPostId, loadSponsoredPosts, sponsoredPosts } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadSponsoredPosts();
    }
  }, [isAuthenticated, loadSponsoredPosts]);

  useEffect(() => {
    // Show popup after a delay
    const timer = setTimeout(() => {
      if (!isDismissed && isAuthenticated) {
        setIsVisible(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  // Show a sample creator if no sponsored posts
  const featuredCreator = {
    name: 'Luna Chen',
    username: 'lunachen',
    avatar: 'https://i.pravatar.cc/150?u=luna',
    totalDonated: '$48.50',
    supporters: 12,
    topPost: 'The Art of Glassmorphism',
  };

  return (
    <AnimatePresence>
      {isVisible && isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 40, x: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[90] w-[calc(100%-24px)] sm:w-72"
        >
          <div
            className="glass-card p-4 relative overflow-hidden"
            style={{
              background: 'rgba(10,10,10,0.92)',
              backdropFilter: 'blur(30px) saturate(1.4)',
              border: '1px solid rgba(249,115,22,0.12)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(249,115,22,0.05)',
            }}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all z-10"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Orange glow accent */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#f97316] opacity-[0.06] blur-[30px]" />

            {/* Crown badge */}
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f59e0b]/60">
                Creator of the Week
              </span>
            </div>

            {/* Creator info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <img
                  src={featuredCreator.avatar}
                  alt={featuredCreator.name}
                  className="w-10 h-10 rounded-full border border-[#f97316]/20 object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10b981] border-2 border-[#0a0a0a]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{featuredCreator.name}</p>
                <p className="text-[10px] text-white/30">@{featuredCreator.username}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#10b981]/8 border border-[#10b981]/10">
                <DollarSign className="w-3 h-3 text-[#10b981]/60" />
                <span className="text-xs font-semibold text-[#10b981]">{featuredCreator.totalDonated}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#f97316]/8 border border-[#f97316]/10">
                <Heart className="w-3 h-3 text-[#f97316]/60" />
                <span className="text-xs font-semibold text-[#f97316]">{featuredCreator.supporters}</span>
              </div>
            </div>

            {/* Top post */}
            <p className="text-[10px] text-white/20 mb-3 truncate">
              Top: {featuredCreator.topPost}
            </p>

            {/* Donate shortcut */}
            <button
              onClick={() => {
                navigate('profile', { username: featuredCreator.username });
                setIsVisible(false);
              }}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#f97316]/15 to-[#ea580c]/10 border border-[#f97316]/20 text-[#f97316] text-xs font-bold hover:from-[#f97316]/25 hover:to-[#ea580c]/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3 h-3" />
              Support This Creator
            </button>

            {/* 80/20 trust label */}
            <p className="text-[9px] text-white/15 text-center mt-2">
              80% Creator / 20% Platform
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
