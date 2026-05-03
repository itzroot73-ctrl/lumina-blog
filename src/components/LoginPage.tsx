'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login, navigate } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to Lumina!');
      navigate('home');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f97316] rounded-full opacity-[0.04] blur-[40px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#ea580c] rounded-full opacity-[0.03] blur-[40px]" />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] mx-auto mb-5 flex items-center justify-center"
              style={{ boxShadow: '0 0 30px rgba(249,115,22,0.25)' }}
            >
              <span className="text-white text-2xl font-black">L</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Welcome back to Lumina</h2>
            <p className="text-white/30 text-sm mt-2">Sign in to explore stories, support creators, and publish your own content</p>
          </div>

          {/* Demo credentials */}
          <div className="mb-6 p-3 rounded-xl bg-[#f97316]/5 border border-[#f97316]/10">
            <p className="text-xs text-[#f97316]/70 text-center font-medium">
              Demo: luna@artisan.dev / password123
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="glass-input pl-10 h-12 text-white placeholder:text-white/20 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="glass-input pl-10 pr-10 h-12 text-white placeholder:text-white/20 text-sm rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-90 text-white border-0 font-bold text-sm rounded-xl"
              style={{ boxShadow: '0 0 20px rgba(249,115,22,0.2)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/30">
              Don&apos;t have an account?{' '}
              <button onClick={() => navigate('register')} className="text-[#f97316] hover:underline font-semibold">
                Create one
              </button>
            </p>
          </div>

          {/* Trust indicator */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-[10px] text-white/15 text-center">
              By signing in, you agree to Lumina&apos;s Terms of Service. 80% of all creator support goes directly to artists.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
