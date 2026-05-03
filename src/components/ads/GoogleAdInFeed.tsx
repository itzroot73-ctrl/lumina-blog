'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAdSense } from './AdSenseProvider';
import { Megaphone } from 'lucide-react';

// Placeholder ad slot IDs — replace with real Google AdSense ad slot IDs
const INFEED_AD_SLOTS = [
  'XXXXXXXXXX', // Replace with your in-feed ad slot ID
  'YYYYYYYYYY', // Replace with your second in-feed ad slot ID
  'ZZZZZZZZZZ', // Replace with your third in-feed ad slot ID
];

interface GoogleAdInFeedProps {
  index?: number;
  className?: string;
}

export default function GoogleAdInFeed({ index = 0, className = '' }: GoogleAdInFeedProps) {
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
      { rootMargin: '200px' } // Start loading when within 200px of viewport
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

  const slotId = INFEED_AD_SLOTS[index % INFEED_AD_SLOTS.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      ref={adRef}
      className={`glass-ad-card overflow-hidden relative ${className}`}
    >
      {/* Sponsored label */}
      <div className="absolute top-2 right-2 z-10">
        <span className="text-[9px] text-white/20 uppercase tracking-[0.15em] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
          Sponsored
        </span>
      </div>

      {/* Google In-Feed Ad Unit */}
      {isVisible ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="fluid"
          data-ad-layout-key="-6t+ed+2i-1n-4w"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
        />
      ) : (
        /* Placeholder while lazy loading */
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97316]/10 to-[#f59e0b]/10 border border-white/5 flex items-center justify-center mb-3">
            <Megaphone className="w-5 h-5 text-white/15" />
          </div>
          <div className="space-y-2 w-full max-w-[200px]">
            <div className="h-3 bg-white/5 rounded-full animate-pulse" />
            <div className="h-3 bg-white/5 rounded-full animate-pulse w-3/4" />
            <div className="h-8 bg-white/[0.03] rounded-lg mt-3" />
          </div>
        </div>
      )}

      {/* Decorative glow */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-[40px] pointer-events-none bg-gradient-to-r from-[#f97316] to-[#f59e0b]" />
    </motion.div>
  );
}
