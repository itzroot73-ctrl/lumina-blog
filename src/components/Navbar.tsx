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
import { PenSquare, User, LogOut, Home, Crown } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, navigate, setShowPremiumModal } = useAppStore();

  const isPremium = user?.isPremium ?? false;

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="text-xl font-bold text-glow-cyan neon-cyan tracking-tight">
              Artisan
            </span>
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('home')}
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <Home className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Home</span>
            </Button>

            {isAuthenticated && user?.role === 'artist' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('dashboard')}
                className="text-white/70 hover:text-white hover:bg-white/5"
              >
                <PenSquare className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            )}

            {/* Go Premium Button — only show if not premium */}
            {!isPremium && (
              <Button
                size="sm"
                onClick={() => setShowPremiumModal(true)}
                className="relative bg-gradient-to-r from-[#f59e0b] to-[#f43f5e] hover:opacity-90 text-white border-0 font-semibold animate-pulse-glow overflow-hidden"
              >
                <Crown className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Go Premium</span>
              </Button>
            )}

            {/* Premium badge if user is premium */}
            {isPremium && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#f59e0b]/15 to-[#f43f5e]/15 border border-[#f59e0b]/20">
                <Crown className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="text-xs font-semibold text-[#f59e0b] hidden sm:inline">Premium</span>
              </div>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-8 w-8 border border-white/10">
                      <AvatarImage
                        src={user?.avatar || undefined}
                        alt={user?.name || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 text-white text-xs">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="glass w-56"
                  align="end"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-white/50">@{user?.username}</p>
                    {isPremium && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-[#f59e0b] font-semibold">
                        <Crown className="w-3 h-3" /> Premium Member
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-white/70 focus:text-white focus:bg-white/5 cursor-pointer"
                    onClick={() => navigate('profile', { username: user?.username || '' })}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user?.role === 'artist' && (
                    <DropdownMenuItem
                      className="text-white/70 focus:text-white focus:bg-white/5 cursor-pointer"
                      onClick={() => navigate('dashboard')}
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  {!isPremium && (
                    <DropdownMenuItem
                      className="text-[#f59e0b] focus:text-[#f59e0b] focus:bg-white/5 cursor-pointer"
                      onClick={() => setShowPremiumModal(true)}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Go Premium
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-300 focus:bg-white/5 cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('login')}
                  className="text-white/70 hover:text-white hover:bg-white/5"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('register')}
                  className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] hover:opacity-90 text-white border-0"
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
