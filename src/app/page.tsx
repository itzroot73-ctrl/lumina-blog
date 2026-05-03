'use client';

import { useAppStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import LandingPage from '@/components/LandingPage';
import HomeFeed from '@/components/HomeFeed';
import LoginPage from '@/components/LoginPage';
import RegisterPage from '@/components/RegisterPage';
import Dashboard from '@/components/Dashboard';
import PostDetail from '@/components/PostDetail';
import ArtistProfile from '@/components/ArtistProfile';
import PremiumCheckout from '@/components/PremiumCheckout';
import SupportArtistModal from '@/components/SupportArtistModal';
import SponsorModal from '@/components/SponsorModal';
import SponsorPopup from '@/components/SponsorPopup';
import { AdSenseProvider } from '@/components/ads';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import Lenis from 'lenis';

function ViewRenderer({ view }: { view: string }) {
  const actualView = view === 'browse' ? 'home' : view;
  switch (actualView) {
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
  const { currentView, checkAuth, isAuthenticated, isLoadingAuth, seeded, setSeeded, cookieConsent, setCookieConsent } = useAppStore();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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

  const handleCookieAccept = () => { setCookieConsent(true); };
  const handleCookieDecline = () => { setCookieConsent(false); };
  const handleCookieDismiss = () => { setCookieConsent(false); };

  // Loading state
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center mx-auto mb-5 animate-pulse"
            style={{ boxShadow: '0 0 40px rgba(249,115,22,0.3)' }}
          >
            <span className="text-white text-2xl font-black">L</span>
          </div>
          <div className="w-6 h-6 border-2 border-[#f97316]/30 border-t-[#f97316] rounded-full animate-spin mx-auto" />
          <p className="text-[10px] text-white/15 uppercase tracking-[0.3em] mt-4">Loading Lumina</p>
        </motion.div>
      </div>
    );
  }

  const showLanding = !isAuthenticated && currentView === 'home';

  return (
    <AdSenseProvider cookieConsent={cookieConsent}>
      <div className="min-h-screen bg-[#0a0a0a] relative">
        {showLanding ? (
          <LandingPage />
        ) : (
          <>
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
              <footer className="glass-nav-cinematic border-t border-white/[0.03] mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <img src="/logo.png" alt="Lumina" className="h-5 w-5 rounded" />
                      <span className="text-xs text-white/25 font-medium">Lumina Blog Platform</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-white/10 uppercase tracking-wider">80% Creator / 20% Platform</span>
                      <span className="text-white/5">|</span>
                      <p className="text-[10px] text-white/10 tracking-wider uppercase">
                        Next.js / GSAP / Framer Motion
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            {/* Sponsor Popup — bottom right floating card */}
            <SponsorPopup />
          </>
        )}

        {/* Premium Checkout Modal */}
        <PremiumCheckout />

        {/* Support Artist Donation Modal */}
        <SupportArtistModal />

        {/* Sponsor/Boost Modal */}
        <SponsorModal />

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
