'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, AtSign, ArrowRight, Palette, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { register, navigate } = useAppStore();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('artist');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ email, name, username, password, role });
      toast.success('Welcome to Artisan!');
      navigate('home');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#10b981] mx-auto mb-4 flex items-center justify-center"
            >
              <User className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Join Artisan</h2>
            <p className="text-white/40 text-sm mt-1">Create your account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-white/70 text-sm mb-3 block">
              I am a...
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`p-3 rounded-xl border transition-all text-center ${
                  role === 'artist'
                    ? 'border-[#f97316]/50 bg-[#f97316]/10 text-[#f97316]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                <Palette className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Artist</span>
                <p className="text-xs opacity-60 mt-0.5">Publish & create</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('reader')}
                className={`p-3 rounded-xl border transition-all text-center ${
                  role === 'reader'
                    ? 'border-[#f59e0b]/50 bg-[#f59e0b]/10 text-[#f59e0b]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                <BookOpen className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Reader</span>
                <p className="text-xs opacity-60 mt-0.5">Discover & engage</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name" className="text-white/70 text-sm">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="reg-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="glass-input pl-10 h-11 text-white placeholder:text-white/25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-username" className="text-white/70 text-sm">
                Username
              </Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="reg-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="username"
                  className="glass-input pl-10 h-11 text-white placeholder:text-white/25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-white/70 text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="glass-input pl-10 h-11 text-white placeholder:text-white/25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-white/70 text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="glass-input pl-10 h-11 text-white placeholder:text-white/25"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[#f59e0b] to-[#10b981] hover:opacity-90 text-white border-0 font-medium"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('login')}
              className="text-[#f97316] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
