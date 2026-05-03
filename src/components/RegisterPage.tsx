'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, AtSign, ArrowRight, Palette, BookOpen, Camera, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { register, navigate } = useAppStore();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('artist');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      await register({ email, name, username, password, role, avatar: avatar || undefined });
      toast.success('Welcome to Lumina! Start creating amazing content.');
      navigate('home');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
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
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#f59e0b] rounded-full opacity-[0.04] blur-[40px]" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#10b981] rounded-full opacity-[0.03] blur-[40px]" />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#10b981] mx-auto mb-5 flex items-center justify-center"
              style={{ boxShadow: '0 0 30px rgba(245,158,11,0.2)' }}
            >
              <span className="text-white text-2xl font-black">L</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Join Lumina</h2>
            <p className="text-white/30 text-sm mt-2">Create your account and start sharing your stories with the world</p>
          </div>

          {/* Avatar Upload Area */}
          <div className="mb-6">
            <Label className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-3 block">
              Profile Photo
            </Label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 hover:border-[#f97316]/30 transition-colors overflow-hidden group">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white/15 group-hover:text-[#f97316]/40 transition-colors" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Paste image URL for your avatar"
                  className="glass-input h-10 text-white placeholder:text-white/20 text-xs rounded-lg"
                />
                <p className="text-[10px] text-white/15 mt-1">Use a URL for your profile picture</p>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-3 block">
              I am a...
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`p-4 rounded-xl border transition-all text-center ${
                  role === 'artist'
                    ? 'border-[#f97316]/50 bg-[#f97316]/10 text-[#f97316]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                <Palette className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">Artist</span>
                <p className="text-xs opacity-60 mt-1">Publish articles & videos</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('reader')}
                className={`p-4 rounded-xl border transition-all text-center ${
                  role === 'reader'
                    ? 'border-[#f59e0b]/50 bg-[#f59e0b]/10 text-[#f59e0b]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                <BookOpen className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">Reader</span>
                <p className="text-xs opacity-60 mt-1">Discover & support creators</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name" className="text-white/60 text-xs uppercase tracking-wider font-semibold">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your display name" className="glass-input pl-10 h-11 text-white placeholder:text-white/20 text-sm rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-username" className="text-white/60 text-xs uppercase tracking-wider font-semibold">Username</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <Input id="reg-username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} placeholder="unique_username" className="glass-input pl-10 h-11 text-white placeholder:text-white/20 text-sm rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-white/60 text-xs uppercase tracking-wider font-semibold">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="glass-input pl-10 h-11 text-white placeholder:text-white/20 text-sm rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-white/60 text-xs uppercase tracking-wider font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <Input id="reg-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="glass-input pl-10 pr-10 h-11 text-white placeholder:text-white/20 text-sm rounded-xl" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#f59e0b] to-[#10b981] hover:opacity-90 text-white border-0 font-bold text-sm rounded-xl"
              style={{ boxShadow: '0 0 20px rgba(245,158,11,0.15)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('login')} className="text-[#f97316] hover:underline font-semibold">Sign in</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
