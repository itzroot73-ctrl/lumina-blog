'use client';

import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Zap, Check, Shield, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];
const DURATION_OPTIONS = [
  { hours: 24, label: '24 Hours', price: '$5' },
  { hours: 48, label: '48 Hours', price: '$10' },
  { hours: 72, label: '72 Hours', price: '$15' },
  { hours: 168, label: '1 Week', price: '$25' },
];

export default function SponsorModal() {
  const {
    showSponsorModal,
    setShowSponsorModal,
    sponsorPostId,
    currentPost,
    createSponsorship,
    isAuthenticated,
    navigate,
  } = useAppStore();

  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [duration, setDuration] = useState(24);
  const [step, setStep] = useState<'amount' | 'checkout' | 'success'>('amount');
  const [processing, setProcessing] = useState(false);

  const selectedAmount = customAmount ? parseFloat(customAmount) : amount;

  const handleClose = () => {
    setShowSponsorModal(false);
    setTimeout(() => {
      setStep('amount');
      setCustomAmount('');
      setAmount(10);
      setDuration(24);
    }, 300);
  };

  const handleProceed = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to sponsor content');
      navigate('login');
      handleClose();
      return;
    }
    setStep('checkout');
  };

  const handleSponsor = async () => {
    if (!sponsorPostId) return;
    setProcessing(true);
    try {
      await createSponsorship(sponsorPostId, selectedAmount, duration);
      setStep('success');
      toast.success('Post sponsored successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sponsor post');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {showSponsorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md glass-card overflow-hidden"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="relative h-28 bg-gradient-to-br from-[#f97316]/20 via-[#ea580c]/15 to-[#0a0a0a] flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center"
                style={{ boxShadow: '0 0 30px rgba(249,115,22,0.3)' }}
              >
                <Zap className="w-7 h-7 text-white" />
              </motion.div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#f97316] rounded-full opacity-10 blur-[50px]" />
            </div>

            <div className="p-6 pt-8">
              {currentPost && (
                <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Avatar className="h-10 w-10 border border-[#f97316]/20">
                    <AvatarImage src={currentPost.author.avatar || undefined} alt={currentPost.author.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-sm">
                      {currentPost.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{currentPost.title}</p>
                    <p className="text-xs text-white/30">by {currentPost.author.name}</p>
                  </div>
                </div>
              )}

              {step === 'amount' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-xl font-bold text-white mb-1 text-center">Boost This Post</h2>
                  <p className="text-white/30 text-sm text-center mb-6">Pin this story to the top of the feed</p>

                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Sponsorship Amount</h3>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {PRESET_AMOUNTS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => { setAmount(preset); setCustomAmount(''); }}
                        className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                          amount === preset && !customAmount
                            ? 'bg-[#f97316] text-white shadow-lg shadow-[#f97316]/20'
                            : 'bg-white/[0.04] border border-white/10 text-white/50 hover:border-[#f97316]/30 hover:text-white/70'
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>

                  <div className="relative mb-5">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f97316]/40" />
                    <Input
                      type="number"
                      min="1"
                      max="1000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Custom amount"
                      className="glass-input pl-9 h-11 text-white placeholder:text-white/25"
                    />
                  </div>

                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Duration</h3>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.hours}
                        onClick={() => setDuration(opt.hours)}
                        className={`p-3 rounded-xl text-left transition-all ${
                          duration === opt.hours
                            ? 'bg-[#f97316]/12 border border-[#f97316]/30'
                            : 'bg-white/[0.03] border border-white/8 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className={`w-3.5 h-3.5 ${duration === opt.hours ? 'text-[#f97316]' : 'text-white/25'}`} />
                          <span className={`text-sm font-semibold ${duration === opt.hours ? 'text-[#f97316]' : 'text-white/50'}`}>{opt.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Trust note */}
                  <div className="flex items-start gap-2 mb-6 p-3 rounded-lg bg-[#f97316]/5 border border-[#f97316]/10">
                    <Shield className="w-4 h-4 text-[#f97316]/40 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/25 leading-relaxed">
                      100% of your sponsorship fee goes to keeping Lumina free for everyone. Your boosted post will appear at the top of the feed with a special glow.
                    </p>
                  </div>

                  <Button
                    onClick={handleProceed}
                    className="w-full h-12 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-90 text-white border-0 font-semibold text-sm"
                    style={{ boxShadow: '0 0 20px rgba(249,115,22,0.2)' }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {step === 'checkout' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-xl font-bold text-white mb-4 text-center">Complete Sponsorship</h2>

                  <div className="glass-card p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Sponsorship fee</span>
                      <span className="text-sm font-semibold text-white">${selectedAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Duration</span>
                      <span className="text-sm text-white/50">{duration}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Goes to</span>
                      <span className="text-sm text-[#f97316]">Platform (100%)</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Card Number</label>
                      <div className="glass-input h-10 flex items-center px-3 text-sm text-white/40">•••• •••• •••• 4242</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-white/50 mb-1 block">Expiry</label><div className="glass-input h-10 flex items-center px-3 text-sm text-white/40">12/28</div></div>
                      <div><label className="text-xs text-white/50 mb-1 block">CVC</label><div className="glass-input h-10 flex items-center px-3 text-sm text-white/40">•••</div></div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep('amount')} className="flex-1 border-white/10 text-white/60 hover:bg-white/5 hover:text-white">Back</Button>
                    <Button onClick={handleSponsor} disabled={processing} className="flex-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-90 text-white border-0 font-semibold">
                      {processing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4 mr-1.5" />Sponsor ${selectedAmount.toFixed(2)}</>}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f97316] to-[#f59e0b] flex items-center justify-center mx-auto mb-4"
                    style={{ boxShadow: '0 0 30px rgba(249,115,22,0.3)' }}
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Post Boosted!</h3>
                  <p className="text-sm text-white/40 mb-2">Your sponsored post is now at the top of the feed</p>
                  <p className="text-xs text-[#f97316]/60 mb-6">Active for {duration} hours with orange neon glow</p>
                  <Button onClick={handleClose} className="bg-gradient-to-r from-[#f97316] to-[#f59e0b] hover:opacity-90 text-white border-0">
                    Continue
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
