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
import { PenSquare, User, LogOut, Crown, Rss, Wallet } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, navigate, setShowPremiumModal } = useAppStore();

  const isPremium = user?.isPremium ?? false;

  const handleLogoClick = () => {
    navigate(isAuthenticated ? 'home' : 'browse');
  };

  return (
    <nav className="glass-nav-cinematic sticky top-0 z-50">
      {/* Orange & Black subtle top glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f97316]/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo — Lumin branding with logo image */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img src="/logo.png" alt="Lumina" className="h-8 w-8 rounded-md" />
            <span className="text-lg font-black tracking-tight hidden sm:inline">
              <span className="text-[#f97316] text-glow-orange">Lum</span>
              <span className="text-white/80">ina</span>
            </span>
          </button>

          {/* Navigation — Orange & Black minimal style */}
          <div className="flex items-center gap-1">
            {/* Feed nav item */}
            <button
              onClick={() => navigate(isAuthenticated ? 'home' : 'browse')}
              className="nav-link-item group"
            >
              <Rss className="w-3.5 h-3.5 text-[#f97316]/40 group-hover:text-[#f97316] transition-colors" />
              <span className="hidden sm:inline text-white/50 group-hover:text-white/80 transition-colors">Feed</span>
            </button>

            {isAuthenticated && user?.role === 'artist' && (
              <button
                onClick={() => navigate('dashboard')}
                className="nav-link-item group"
              >
                <PenSquare className="w-3.5 h-3.5 text-[#f59e0b]/40 group-hover:text-[#f59e0b] transition-colors" />
                <span className="hidden sm:inline text-white/50 group-hover:text-white/80 transition-colors">Write</span>
              </button>
            )}

            {/* Go Premium Button — Orange accent */}
            {!isPremium && (
              <Button
                size="sm"
                onClick={() => setShowPremiumModal(true)}
                className="relative bg-gradient-to-r from-[#f97316]/20 to-[#f59e0b]/20 hover:from-[#f97316]/30 hover:to-[#f59e0b]/30 text-white border border-[#f97316]/20 hover:border-[#f97316]/40 font-bold h-7 text-[11px] px-3 rounded-full transition-all"
              >
                <Crown className="w-3 h-3 mr-1 text-[#f59e0b]" />
                <span className="hidden sm:inline">Premium</span>
              </Button>
            )}

            {/* Premium badge */}
            {isPremium && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#f59e0b]/10 to-[#f97316]/10 border border-[#f59e0b]/20">
                <Crown className="w-3 h-3 text-[#f59e0b]" />
                <span className="text-[10px] font-bold text-[#f59e0b] hidden sm:inline">PRO</span>
              </div>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-8 w-8 rounded-full ml-1 ring-1 ring-[#f97316]/15 hover:ring-[#f97316]/40 transition-all">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar || undefined}
                        alt={user?.name || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-xs font-bold">
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
                    <div className="flex items-center gap-2 mt-1">
                      {isPremium && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#f59e0b] font-bold">
                          <Crown className="w-3 h-3" /> Premium
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#10b981] font-bold">
                        <Wallet className="w-3 h-3" /> ${user?.walletBalance?.toFixed(2) || '0.00'}
                      </span>
                    </div>
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
                      className="text-[#f97316] focus:text-[#f97316] focus:bg-white/5 cursor-pointer text-sm"
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
                  className="bg-gradient-to-r from-[#f97316] to-[#f59e0b] hover:opacity-90 text-white border-0 h-7 text-xs px-4 rounded-full font-semibold shadow-lg shadow-[#f97316]/10"
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
