'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CookieConsentBannerProps {
  consentGiven: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onDismiss: () => void;
}

export default function CookieConsentBanner({
  consentGiven,
  onAccept,
  onDecline,
  onDismiss,
}: CookieConsentBannerProps) {
  return (
    <AnimatePresence>
      {!consentGiven && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[90] p-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="glass-cookie-banner relative overflow-hidden">
              {/* Close button */}
              <button
                onClick={onDismiss}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Icon */}
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97316]/15 to-[#f59e0b]/15 border border-white/10 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-[#f97316]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#10b981]" />
                    Your Privacy Matters
                  </h4>
                  <p className="text-xs text-white/40 leading-relaxed">
                    We use cookies and similar technologies to enhance your experience, serve relevant ads,
                    and analyze traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies for
                    advertising purposes. You can learn more in our{' '}
                    <button className="text-[#f97316] hover:underline">Privacy Policy</button>.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDecline}
                    className="flex-1 sm:flex-none border-white/10 text-white/50 hover:text-white/70 hover:bg-white/5 text-xs h-8"
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={onAccept}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-[#f97316] to-[#f59e0b] hover:opacity-90 text-white border-0 text-xs h-8 font-semibold"
                  >
                    Accept Cookies
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
