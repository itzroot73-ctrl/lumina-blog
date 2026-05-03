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
          <p className="text-[10px] text-white/15 uppercase tracking-[0.3em] mt-4">Loading Lumina Blog</p>
        </motion.div>
      </div>
    );
  }

  const showLanding = !isAuthenticated && currentView === 'home';

  return (
    <AdSenseProvider cookieConsent={cookieConsent}>
      <div className="min-h-screen bg-[#0a0a0a] relative">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#f97316] focus:text-white focus:rounded-lg focus:text-sm focus:font-bold">
          Skip to main content
        </a>

        {showLanding ? (
          <LandingPage />
        ) : (
          <>
            <AnimatedBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              <header>
                <Navbar />
              </header>
              <main id="main-content" className="flex-1">
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

              {/* SEO-Optimized Footer with Keyword Strategy */}
              <footer className="glass-nav-cinematic border-t border-white/[0.03] mt-auto" role="contentinfo">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6">
                    {/* Brand Column */}
                    <div className="sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <img src="/logo.png" alt="Lumina Blog Logo" className="h-6 w-6 rounded" width={24} height={24} />
                        <h2 className="text-sm font-bold text-white/60">Lumina Blog</h2>
                      </div>
                      <p className="text-xs text-white/25 leading-relaxed max-w-xs">
                        Lumina Blog is the premier platform for creators to publish Lumina Articles
                        and videos. Discover insightful content on design, technology, and creative craft.
                      </p>
                    </div>

                    {/* Quick Links — helps internal linking for SEO */}
                    <nav aria-label="Footer navigation" className="space-y-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-3">Explore</h3>
                      <ul className="space-y-1.5">
                        <li><span className="text-xs text-white/30 hover:text-[#f97316]/60 transition-colors cursor-default">Lumina Articles</span></li>
                        <li><span className="text-xs text-white/30 hover:text-[#f97316]/60 transition-colors cursor-default">Video Content</span></li>
                        <li><span className="text-xs text-white/30 hover:text-[#f97316]/60 transition-colors cursor-default">Trending Topics</span></li>
                        <li><span className="text-xs text-white/30 hover:text-[#f97316]/60 transition-colors cursor-default">Creator Profiles</span></li>
                      </ul>
                    </nav>

                    {/* About Column with keyword density */}
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-3">About Lumina</h3>
                      <p className="text-xs text-white/25 leading-relaxed">
                        Every Lumina Article published here supports the creator economy.
                        Our 80/20 revenue split ensures artists earn from their craft
                        while keeping Lumina Blog free for readers.
                      </p>
                    </div>

                    {/* Revenue & Tech */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-3">Transparency</h3>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#10b981]/5 border border-[#10b981]/10">
                        <span className="text-[10px] font-bold text-[#10b981]">80%</span>
                        <span className="text-[10px] text-white/25">to Creator</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-[10px] font-bold text-white/40">20%</span>
                        <span className="text-[10px] text-white/25">Platform Fee</span>
                      </div>
                      <p className="text-[9px] text-white/10 tracking-wider uppercase mt-2">
                        Next.js / GSAP / Framer Motion
                      </p>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="border-t border-white/[0.03] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] text-white/15">
                      &copy; {new Date().getFullYear()} Lumina Blog. All rights reserved.
                    </p>
                    <p className="text-[10px] text-white/10 tracking-wider">
                      Lumina Article Platform — Where Creators Shine
                    </p>
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
