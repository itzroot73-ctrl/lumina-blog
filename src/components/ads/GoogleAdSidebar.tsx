'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAdSense } from './AdSenseProvider';
import { MonitorSmartphone } from 'lucide-react';

// Placeholder ad slot ID for sidebar display ads
const SIDEBAR_AD_SLOT = 'BBBBBBBBBB'; // Replace with your sidebar ad slot ID

interface GoogleAdSidebarProps {
  className?: string;
}

export default function GoogleAdSidebar({ className = '' }: GoogleAdSidebarProps) {
  const { isPremium, isLoaded, cookieConsent } = useAdSense();
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adPushed, setAdPushed] = useState(false);

  // Lazy loading via IntersectionObserver
  useEffect(() => {
    if (isPremium || !cookieConsent) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [isPremium, cookieConsent]);

  // Push ad once visible and AdSense script is loaded
  useEffect(() => {
    if (!isVisible || !isLoaded || adPushed || isPremium || !cookieConsent) return;

    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
      adsbygoogle.push({});
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = adsbygoogle;
      setAdPushed(true);
    } catch (e) {
      console.warn('AdSense push error:', e);
    }
  }, [isVisible, isLoaded, adPushed, isPremium, cookieConsent]);

  // Don't render anything for premium users
  if (isPremium) return null;

  // Don't render if no cookie consent
  if (!cookieConsent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      ref={adRef}
      className={`glass-ad-sidebar sticky top-20 relative ${className}`}
    >
      {/* Sponsored label */}
      <div className="absolute top-3 right-3 z-10">
        <span className="text-[9px] text-white/20 uppercase tracking-[0.15em] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
          Sponsored
        </span>
      </div>

      {/* Google Display Ad Unit */}
      {isVisible ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={SIDEBAR_AD_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        /* Placeholder while lazy loading */
        <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[250px]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b]/10 to-[#f43f5e]/10 border border-white/5 flex items-center justify-center mb-3">
            <MonitorSmartphone className="w-5 h-5 text-white/15" />
          </div>
          <div className="space-y-2 w-full">
            <div className="h-3 bg-white/5 rounded-full animate-pulse" />
            <div className="h-3 bg-white/5 rounded-full animate-pulse w-3/4" />
            <div className="h-3 bg-white/5 rounded-full animate-pulse w-1/2" />
          </div>
        </div>
      )}

      {/* Decorative glow */}
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10 blur-[30px] pointer-events-none bg-gradient-to-r from-[#f59e0b] to-[#f43f5e]" />
    </motion.div>
  );
}
