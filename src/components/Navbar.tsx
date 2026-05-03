'use client';

import { useAppStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PenSquare, User, LogOut, Crown, Rss } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, navigate, setShowPremiumModal } = useAppStore();

  const isPremium = user?.isPremium ?? false;

  return (
    <nav className="glass-nav-cinematic sticky top-0 z-50">
      {/* SpiderHeck-style subtle top glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo — 'L' branding for SpiderHeck feel */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#00f0ff] to-[#a855f7] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#00f0ff]/20 group-hover:shadow-[#00f0ff]/40 transition-shadow">
              L
            </div>
            <span className="text-lg font-black tracking-tight hidden sm:inline">
              <span className="text-[#00f0ff] text-glow-cyan">L</span>
              <span className="text-white/80">umin</span>
            </span>
          </button>

          {/* Navigation — SpiderHeck minimal style */}
          <div className="flex items-center gap-1">
            {/* Feed nav item */}
            <button
              onClick={() => navigate('home')}
              className="nav-link-item group"
            >
              <Rss className="w-3.5 h-3.5 text-[#00f0ff]/40 group-hover:text-[#00f0ff] transition-colors" />
              <span className="hidden sm:inline text-white/50 group-hover:text-white/80 transition-colors">Feed</span>
            </button>

            {isAuthenticated && user?.role === 'artist' && (
              <button
                onClick={() => navigate('dashboard')}
                className="nav-link-item group"
              >
                <PenSquare className="w-3.5 h-3.5 text-[#a855f7]/40 group-hover:text-[#a855f7] transition-colors" />
                <span className="hidden sm:inline text-white/50 group-hover:text-white/80 transition-colors">Write</span>
              </button>
            )}

            {/* Go Premium Button — SpiderHeck neon accent */}
            {!isPremium && (
              <Button
                size="sm"
                onClick={() => setShowPremiumModal(true)}
                className="relative bg-gradient-to-r from-[#00f0ff]/20 to-[#a855f7]/20 hover:from-[#00f0ff]/30 hover:to-[#a855f7]/30 text-white border border-[#00f0ff]/20 hover:border-[#00f0ff]/40 font-bold h-7 text-[11px] px-3 rounded-full transition-all"
              >
                <Crown className="w-3 h-3 mr-1 text-[#f59e0b]" />
                <span className="hidden sm:inline">Premium</span>
              </Button>
            )}

            {/* Premium badge */}
            {isPremium && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#f59e0b]/10 to-[#f43f5e]/10 border border-[#f59e0b]/20">
                <Crown className="w-3 h-3 text-[#f59e0b]" />
                <span className="text-[10px] font-bold text-[#f59e0b] hidden sm:inline">PRO</span>
              </div>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-8 w-8 rounded-full ml-1 ring-1 ring-[#00f0ff]/15 hover:ring-[#00f0ff]/40 transition-all">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar || undefined}
                        alt={user?.name || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 text-white text-xs font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="glass-cinematic-dropdown w-52"
                  align="end"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-white/40">@{user?.username}</p>
                    {isPremium && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-[#f59e0b] font-bold">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem
                    className="text-white/60 focus:text-white focus:bg-white/5 cursor-pointer text-sm"
                    onClick={() => navigate('profile', { username: user?.username || '' })}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user?.role === 'artist' && (
                    <DropdownMenuItem
                      className="text-white/60 focus:text-white focus:bg-white/5 cursor-pointer text-sm"
                      onClick={() => navigate('dashboard')}
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  {!isPremium && (
                    <DropdownMenuItem
                      className="text-[#00f0ff] focus:text-[#00f0ff] focus:bg-white/5 cursor-pointer text-sm"
                      onClick={() => setShowPremiumModal(true)}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Go Premium
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem
                    className="text-red-400/70 focus:text-red-300 focus:bg-white/5 cursor-pointer text-sm"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('login')}
                  className="text-white/40 hover:text-white/70 hover:bg-white/5 h-7 text-xs px-3 rounded-full"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('register')}
                  className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] hover:opacity-90 text-white border-0 h-7 text-xs px-4 rounded-full font-semibold shadow-lg shadow-[#00f0ff]/10"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
