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
import PremiumCheckout from '@/components/PremiumCheckout';
import { AdSenseProvider } from '@/components/ads';
import CookieConsentBanner from '@/components/CookieConsentBanner';

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
  const { currentView, checkAuth, seeded, setSeeded, cookieConsent, setCookieConsent } = useAppStore();

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

  const handleCookieAccept = () => {
    setCookieConsent(true);
  };

  const handleCookieDecline = () => {
    setCookieConsent(false);
  };

  const handleCookieDismiss = () => {
    setCookieConsent(false);
  };

  return (
    <AdSenseProvider cookieConsent={cookieConsent}>
      <div className="min-h-screen bg-[#060610] relative">
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

          {/* Footer — SpiderHeck styled */}
          <footer className="glass-nav-cinematic border-t border-white/[0.03] mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-[#00f0ff] to-[#a855f7] flex items-center justify-center text-white font-black text-[9px]">
                    L
                  </div>
                  <span className="text-xs text-white/25 font-medium">Lumin Blog Platform</span>
                </div>
                <p className="text-[10px] text-white/10 tracking-wider uppercase">
                  Next.js / Tailwind / Framer Motion
                </p>
              </div>
            </div>
          </footer>
        </div>

        {/* Premium Checkout Modal */}
        <PremiumCheckout />

        {/* Cookie Consent Banner */}
        <CookieConsentBanner
          consentGiven={cookieConsent}
          onAccept={handleCookieAccept}
          onDecline={handleCookieDecline}
          onDismiss={handleCookieDismiss}
        />
      </div>
    </AdSenseProvider>
  );
}
