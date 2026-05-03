'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAdSense } from './AdSenseProvider';
import { FileText } from 'lucide-react';

// Placeholder ad slot ID for in-article ads
const INARTICLE_AD_SLOT = 'AAAAAAAAAA'; // Replace with your in-article ad slot ID

interface GoogleAdInArticleProps {
  className?: string;
}

export default function GoogleAdInArticle({ className = '' }: GoogleAdInArticleProps) {
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={adRef}
      className={`glass-ad-inarticle my-8 relative ${className}`}
    >
      {/* Sponsored label */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <span className="w-6 h-px bg-white/10" />
          Advertisement
          <span className="w-6 h-px bg-white/10" />
        </span>
      </div>

      {/* Google In-Article Ad Unit */}
      {isVisible ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={INARTICLE_AD_SLOT}
        />
      ) : (
        /* Placeholder while lazy loading */
        <div className="flex items-center justify-center min-h-[120px] glass-card p-6">
          <div className="flex items-center gap-3 text-white/10">
            <FileText className="w-5 h-5" />
            <div className="space-y-2">
              <div className="h-2.5 bg-white/5 rounded-full w-40 animate-pulse" />
              <div className="h-2.5 bg-white/5 rounded-full w-28 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
