'use client';

import { useEffect, createContext, useContext, useState, type ReactNode } from 'react';
import { useAppStore } from '@/lib/store';

interface AdSenseContextValue {
  isLoaded: boolean;
  isPremium: boolean;
  cookieConsent: boolean;
  publisherId: string;
}

const AdSenseContext = createContext<AdSenseContextValue>({
  isLoaded: false,
  isPremium: false,
  cookieConsent: false,
  publisherId: '',
});

export const useAdSense = () => useContext(AdSenseContext);

// Google AdSense Publisher ID — replace with your real publisher ID
const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX';

interface AdSenseProviderProps {
  children: ReactNode;
  cookieConsent: boolean;
}

export default function AdSenseProvider({ children, cookieConsent }: AdSenseProviderProps) {
  const { user } = useAppStore();
  const isPremium = user?.isPremium ?? false;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Do NOT load AdSense script if user is premium (page speed optimization)
    // Do NOT load if cookie consent hasn't been given (GDPR compliance)
    if (isPremium || !cookieConsent) {
      setIsLoaded(false);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com"]`
    );

    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    // Lazy load the AdSense script — only after initial page load
    const loadAdSense = () => {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-ad-client', ADSENSE_PUBLISHER_ID);

      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        console.warn('AdSense script failed to load');
        setIsLoaded(false);
      };

      document.head.appendChild(script);
    };

    // Use requestIdleCallback for non-critical loading, fallback to setTimeout
    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadAdSense);
    } else {
      setTimeout(loadAdSense, 2000);
    }

    return () => {
      // Cleanup: remove the script if component unmounts (user becomes premium)
      // Note: AdSense doesn't have a clean unload, but we prevent future ad renders
    };
  }, [isPremium, cookieConsent]);

  // If premium, remove existing AdSense scripts and ad elements
  useEffect(() => {
    if (isPremium) {
      const scripts = document.querySelectorAll(
        `script[src*="pagead2.googlesyndication.com"]`
      );
      scripts.forEach((s) => s.remove());

      setIsLoaded(false);
    }
  }, [isPremium]);

  return (
    <AdSenseContext.Provider
      value={{
        isLoaded,
        isPremium,
        cookieConsent,
        publisherId: ADSENSE_PUBLISHER_ID,
      }}
    >
      {children}
    </AdSenseContext.Provider>
  );
}
