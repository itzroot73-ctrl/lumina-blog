'use client';

import { useAppStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import HomeFeed from '@/components/HomeFeed';
import LoginPage from '@/components/LoginPage';
import RegisterPage from '@/components/RegisterPage';
import Dashboard from '@/components/Dashboard';
import PostDetail from '@/components/PostDetail';
import ArtistProfile from '@/components/ArtistProfile';

function ViewRenderer({ view }: { view: string }) {
  switch (view) {
    case 'home':
      return <HomeFeed />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'dashboard':
      return <Dashboard />;
    case 'post':
      return <PostDetail />;
    case 'profile':
      return <ArtistProfile />;
    default:
      return <HomeFeed />;
  }
}

export default function Home() {
  const { currentView, checkAuth, seeded, setSeeded } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Seed database on first load
  useEffect(() => {
    if (!seeded) {
      fetch('/api/seed')
        .then((res) => res.json())
        .then((data) => {
          console.log('Seed result:', data.message || data);
          setSeeded(true);
        })
        .catch((err) => {
          console.error('Seed error:', err);
          setSeeded(true);
        });
    }
  }, [seeded, setSeeded]);

  return (
    <div className="min-h-screen bg-[#0a0a14] relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <ViewRenderer view={currentView} />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="glass-nav border-t border-white/5 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00f0ff] to-[#a855f7] flex items-center justify-center text-white font-bold text-xs">
                  A
                </div>
                <span className="text-sm text-white/40">Artisan Blog Platform</span>
              </div>
              <p className="text-xs text-white/20">
                Built with Next.js, Tailwind CSS & Framer Motion
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
