'use client';

import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  X,
  Heart,
  DollarSign,
  Check,
  Info,
  CreditCard,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const PRESET_AMOUNTS = [2, 5, 10, 25, 50];

export default function SupportArtistModal() {
  const {
    showDonationModal,
    setShowDonationModal,
    donationPostId,
    currentPost,
    createDonation,
    isAuthenticated,
    navigate,
    token,
  } = useAppStore();

  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'amount' | 'checkout' | 'success'>('amount');
  const [processing, setProcessing] = useState(false);

  const selectedAmount = customAmount ? parseFloat(customAmount) : amount;
  const artistShare = parseFloat((selectedAmount * 0.80).toFixed(2));
  const platformFee = parseFloat((selectedAmount * 0.20).toFixed(2));

  const handleClose = () => {
    setShowDonationModal(false);
    setTimeout(() => {
      setStep('amount');
      setCustomAmount('');
      setMessage('');
      setAmount(5);
    }, 300);
  };

  const handleProceed = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to support artists');
      navigate('login');
      handleClose();
      return;
    }
    setStep('checkout');
  };

  const handleDonate = async () => {
    if (!donationPostId) return;
    setProcessing(true);
    try {
      await createDonation(donationPostId, selectedAmount, message || undefined);
      setStep('success');
      toast.success('Thank you for your support!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process donation');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {showDonationModal && (
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
            className="relative w-full max-w-md glass-card overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header gradient */}
            <div className="relative h-28 bg-gradient-to-br from-[#f97316]/20 via-[#ea580c]/15 to-[#0a0a0a] flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg"
                style={{ boxShadow: '0 0 30px rgba(249,115,22,0.3)' }}
              >
                <Heart className="w-7 h-7 text-white fill-current" />
              </motion.div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#f97316] rounded-full opacity-10 blur-[50px]" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#ea580c] rounded-full opacity-10 blur-[50px]" />
            </div>

            <div className="p-6 pt-8">
              {/* Artist info */}
              {currentPost && (
                <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Avatar className="h-10 w-10 border border-[#f97316]/20">
                    <AvatarImage src={currentPost.author.avatar || undefined} alt={currentPost.author.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-sm">
                      {currentPost.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-white">{currentPost.author.name}</p>
                    <p className="text-xs text-white/30">Support this artist</p>
                  </div>
                </div>
              )}

              {step === 'amount' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-xl font-bold text-white mb-1 text-center">Support the Artist</h2>
                  <p className="text-white/30 text-sm text-center mb-6">Choose an amount to donate</p>

                  {/* Preset amounts */}
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

                  {/* Custom amount */}
                  <div className="relative mb-4">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f97316]/40" />
                    <Input
                      type="number"
                      min="1"
                      max="500"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Custom amount"
                      className="glass-input pl-9 h-11 text-white placeholder:text-white/25"
                    />
                  </div>

                  {/* Message */}
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a message (optional)"
                    className="glass-input h-11 text-white placeholder:text-white/25 mb-6"
                  />

                  {/* Split preview */}
                  <div className="glass-card p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/50">Artist receives (80%)</span>
                      <span className="text-sm font-bold text-[#10b981]">${artistShare}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/50">Platform fee (20%)</span>
                      <span className="text-sm text-white/40">${platformFee}</span>
                    </div>
                    <div className="border-t border-white/5 pt-2 mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Total</span>
                      <span className="text-sm font-bold text-[#f97316]">${selectedAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Transparency note */}
                  <div className="flex items-start gap-2 mb-6 p-3 rounded-lg bg-[#f97316]/5 border border-[#f97316]/10">
                    <Info className="w-4 h-4 text-[#f97316]/50 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/30 leading-relaxed">
                      20% of your support helps keep Lumina free for everyone. The remaining 80% goes directly to the artist.
                    </p>
                  </div>

                  <Button
                    onClick={handleProceed}
                    className="w-full h-12 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-90 text-white border-0 font-semibold text-base"
                    style={{ boxShadow: '0 0 20px rgba(249,115,22,0.2)' }}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {step === 'checkout' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-xl font-bold text-white mb-4 text-center">Complete Payment</h2>

                  {/* Order summary */}
                  <div className="glass-card p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Donation to {currentPost?.author.name}</span>
                      <span className="text-sm font-semibold text-white">${selectedAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Artist receives</span>
                      <span className="text-sm text-[#10b981]">${artistShare}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Platform fee</span>
                      <span className="text-sm text-white/40">${platformFee}</span>
                    </div>
                  </div>

                  {/* Mock payment form */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="text-xs text-white/50 mb-1 block flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3" /> Card Number
                      </label>
                      <div className="glass-input h-10 flex items-center px-3 text-sm text-white/40">
                        •••• •••• •••• 4242
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Expiry</label>
                        <div className="glass-input h-10 flex items-center px-3 text-sm text-white/40">12/28</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">CVC</label>
                        <div className="glass-input h-10 flex items-center px-3 text-sm text-white/40">•••</div>
                      </div>
                    </div>
                  </div>

                  {/* Security note */}
                  <div className="flex items-center gap-2 mb-6 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <Shield className="w-4 h-4 text-[#10b981]/60 shrink-0" />
                    <p className="text-[10px] text-white/25">Secured with 256-bit SSL encryption. Demo mode — no real charges.</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep('amount')}
                      className="flex-1 border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleDonate}
                      disabled={processing}
                      className="flex-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-90 text-white border-0 font-semibold"
                    >
                      {processing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1.5" />
                          Donate ${selectedAmount.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
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
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10b981] to-[#f97316] flex items-center justify-center mx-auto mb-4"
                    style={{ boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
                  >
                    <Heart className="w-8 h-8 text-white fill-current" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-sm text-white/40 mb-2">
                    You supported <span className="text-[#f97316]">{currentPost?.author.name}</span> with ${selectedAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-[#10b981]/60 mb-6">
                    ${artistShare} goes directly to the artist
                  </p>
                  <Button
                    onClick={handleClose}
                    className="bg-gradient-to-r from-[#f97316] to-[#10b981] hover:opacity-90 text-white border-0"
                  >
                    Continue Reading
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
