'use client';

import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  X,
  Crown,
  Zap,
  Shield,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const PREMIUM_FEATURES = [
  { icon: Eye, label: 'Ad-free reading experience', description: 'No distractions, pure content' },
  { icon: Zap, label: 'Priority content access', description: 'Read articles 24h before everyone else' },
  { icon: Crown, label: 'Premium creator badge', description: 'Stand out with an exclusive badge' },
  { icon: Shield, label: 'Advanced analytics', description: 'Deep insights into your audience' },
  { icon: Sparkles, label: 'Custom themes & fonts', description: 'Personalize your reading experience' },
];

export default function PremiumCheckout() {
  const { showPremiumModal, setShowPremiumModal, activatePremium, user } = useAppStore();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'overview' | 'checkout' | 'success'>('overview');

  const handleActivate = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await activatePremium();
    setProcessing(false);
    setStep('success');
    toast.success('Welcome to Artisan Premium!');
  };

  const handleClose = () => {
    setShowPremiumModal(false);
    setTimeout(() => setStep('overview'), 300);
  };

  return (
    <AnimatePresence>
      {showPremiumModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg glass-card overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header gradient */}
            <div className="relative h-32 bg-gradient-to-br from-[#00f0ff]/20 via-[#a855f7]/15 to-[#10b981]/20 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#f43f5e] flex items-center justify-center shadow-lg"
              >
                <Crown className="w-8 h-8 text-white" />
              </motion.div>
              {/* Decorative glows */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#00f0ff] rounded-full opacity-10 blur-[50px]" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#a855f7] rounded-full opacity-10 blur-[50px]" />
            </div>

            <div className="p-6">
              {step === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Artisan Premium
                    </h2>
                    <p className="text-white/40 text-sm">
                      Unlock the full experience
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-6">
                    {PREMIUM_FEATURES.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                      >
                        <feature.icon className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-white">{feature.label}</p>
                          <p className="text-xs text-white/35">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="glass-card p-4 mb-6 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-white">$9</span>
                      <span className="text-white/40 text-sm">/month</span>
                    </div>
                    <p className="text-xs text-white/30 mt-1">Cancel anytime. No commitments.</p>
                  </div>

                  <Button
                    onClick={() => setStep('checkout')}
                    className="w-full h-12 bg-gradient-to-r from-[#f59e0b] to-[#f43f5e] hover:opacity-90 text-white border-0 font-semibold text-base"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Get Premium
                  </Button>

                  {user?.isPremium && (
                    <p className="text-center text-xs text-[#10b981] mt-3">
                      You already have Premium! Enjoy the benefits.
                    </p>
                  )}
                </motion.div>
              )}

              {step === 'checkout' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-bold text-white mb-4 text-center">
                    Complete Purchase
                  </h2>

                  {/* Plan summary */}
                  <div className="glass-card p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Artisan Premium</span>
                      <span className="text-sm font-semibold text-white">$9/mo</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Billing</span>
                      <span className="text-sm text-white/80">Monthly</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">Total</span>
                        <span className="text-sm font-bold text-[#f59e0b]">$9.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock payment form */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Email</label>
                      <div className="glass-input h-10 flex items-center px-3 text-sm text-white/60">
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Card Number</label>
                      <div className="glass-input h-10 flex items-center px-3 text-sm text-white/40">
                        •••• •••• •••• 4242
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Expiry</label>
                        <div className="glass-input h-10 flex items-center px-3 text-sm text-white/40">
                          12/28
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">CVC</label>
                        <div className="glass-input h-10 flex items-center px-3 text-sm text-white/40">
                          •••
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep('overview')}
                      className="flex-1 border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleActivate}
                      disabled={processing}
                      className="flex-1 bg-gradient-to-r from-[#f59e0b] to-[#f43f5e] hover:opacity-90 text-white border-0 font-semibold"
                    >
                      {processing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1.5" />
                          Pay $9.00
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-[10px] text-white/20 mt-4">
                    This is a demo. No real payment is processed.
                  </p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10b981] to-[#00f0ff] flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Welcome to Premium!
                  </h3>
                  <p className="text-sm text-white/40 mb-6">
                    Enjoy an ad-free experience and all premium features.
                  </p>
                  <Button
                    onClick={handleClose}
                    className="bg-gradient-to-r from-[#10b981] to-[#00f0ff] hover:opacity-90 text-white border-0"
                  >
                    Start Reading
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
