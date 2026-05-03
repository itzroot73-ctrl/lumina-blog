import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  bio?: string | null;
  avatar?: string | null;
  coverImage?: string | null;
  role: string;
  isPremium: boolean;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostAuthor {
  id: string;
  name: string;
  username: string;
  avatar?: string | null;
  bio?: string | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  thumbnail?: string | null;
  videoUrl?: string | null;
  postType: 'article' | 'video';
  category: string;
  published: boolean;
  readingTime: number;
  views: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  _count?: {
    likes: number;
    comments: number;
  };
  isSponsored?: boolean;
  sponsorship?: Sponsorship | null;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  author: PostAuthor;
}

export interface ProfileData {
  user: User;
  stats: {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    estimatedRevenue?: number;
    totalDonated?: number;
    walletBalance?: number;
    totalDonationIncome?: number;
    totalSponsorshipIncome?: number;
  };
  posts: Post[];
}

export interface Donation {
  id: string;
  amount: number;
  artistAmount: number;
  platformFee: number;
  postId: string;
  donorId: string;
  artistId: string;
  message?: string | null;
  createdAt: string;
  donor: PostAuthor;
}

export interface Sponsorship {
  id: string;
  postId: string;
  userId: string;
  amount: number;
  duration: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  user?: PostAuthor;
}

export const CATEGORIES = ['All', 'Tech', 'Design', 'Art', 'Lifestyle', 'Science', 'Business', 'Video'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Tech: { bg: 'rgba(249,115,22,0.12)', text: '#f97316', border: 'rgba(249,115,22,0.25)' },
  Design: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  Art: { bg: 'rgba(220,38,38,0.12)', text: '#dc2626', border: 'rgba(220,38,38,0.25)' },
  Lifestyle: { bg: 'rgba(16,185,129,0.12)', text: '#10b981', border: 'rgba(16,185,129,0.25)' },
  Science: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
  Business: { bg: 'rgba(234,179,8,0.12)', text: '#eab308', border: 'rgba(234,179,8,0.25)' },
  Video: { bg: 'rgba(168,85,247,0.12)', text: '#a855f7', border: 'rgba(168,85,247,0.25)' },
};

export type SearchFilter = 'all' | 'articles' | 'videos' | 'sponsored';

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; name: string; username: string; password: string; role?: string; avatar?: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;

  // Navigation
  currentView: string;
  viewParams: Record<string, string>;
  navigate: (view: string, params?: Record<string, string>) => void;

  // Posts
  posts: Post[];
  postsLoading: boolean;
  currentPost: Post | null;
  currentPostComments: Comment[];
  userLikedCurrentPost: boolean;
  loadPosts: (search?: string, category?: string, postType?: string) => Promise<void>;
  loadPost: (id: string) => Promise<void>;
  createPost: (data: { title: string; excerpt?: string; content: string; thumbnail?: string; videoUrl?: string; postType?: 'article' | 'video'; category?: string; published?: boolean; readingTime?: number }) => Promise<Post>;
  updatePost: (id: string, data: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  loadComments: (postId: string) => Promise<void>;

  // Profile
  profileData: ProfileData | null;
  profileLoading: boolean;
  loadProfile: (username: string) => Promise<void>;

  // My Posts (Dashboard)
  myPosts: Post[];
  myPostsStats: { totalPosts: number; publishedPosts: number; draftPosts: number; totalViews: number; totalLikes: number; totalDonationIncome?: number; totalSponsorshipIncome?: number; walletBalance?: number } | null;
  myPostsLoading: boolean;
  loadMyPosts: () => Promise<void>;

  // Premium
  showPremiumModal: boolean;
  setShowPremiumModal: (v: boolean) => void;
  activatePremium: () => Promise<void>;

  // Cookie Consent
  cookieConsent: boolean;
  setCookieConsent: (v: boolean) => void;

  // Donations
  currentPostDonations: Donation[];
  currentPostTotalDonated: number;
  donationLoading: boolean;
  loadDonations: (postId: string) => Promise<void>;
  createDonation: (postId: string, amount: number, message?: string) => Promise<void>;
  showDonationModal: boolean;
  setShowDonationModal: (v: boolean) => void;
  donationPostId: string | null;
  setDonationPostId: (id: string | null) => void;

  // Sponsorships
  sponsoredPosts: Post[];
  loadSponsoredPosts: () => Promise<void>;
  createSponsorship: (postId: string, amount: number, duration: number) => Promise<void>;
  showSponsorModal: boolean;
  setShowSponsorModal: (v: boolean) => void;
  sponsorPostId: string | null;
  setSponsorPostId: (id: string | null) => void;

  // Search Filters
  searchFilter: SearchFilter;
  setSearchFilter: (filter: SearchFilter) => void;

  // Search Overlay
  showSearchOverlay: boolean;
  setShowSearchOverlay: (v: boolean) => void;

  // Earnings Dashboard
  earningsData: { totalDonationIncome: number; totalSponsorshipIncome: number; platformCommission: number; walletBalance: number; recentTransactions: { id: string; type: string; amount: number; description: string; createdAt: string }[] } | null;
  loadEarnings: () => Promise<void>;

  // Seeded flag
  seeded: boolean;
  setSeeded: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  token: null,
  isAuthenticated: false,
  isLoadingAuth: true,

  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  register: async (registerData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    await get().login(registerData.email, registerData.password);
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, currentView: 'home', myPosts: [], myPostsStats: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent === 'true') {
      set({ cookieConsent: true });
    }
    if (!token) {
      set({ isLoadingAuth: false });
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, token, isAuthenticated: true, isLoadingAuth: false });
      } else {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isLoadingAuth: false });
      }
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoadingAuth: false });
    }
  },

  // Navigation
  currentView: 'home',
  viewParams: {},
  navigate: (view, params = {}) => {
    set({ currentView: view, viewParams: params });
    window.scrollTo(0, 0);
  },

  // Posts
  posts: [],
  postsLoading: false,
  currentPost: null,
  currentPostComments: [],
  userLikedCurrentPost: false,

  loadPosts: async (search, category, postType) => {
    set({ postsLoading: true });
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category && category !== 'All') params.set('category', category);
      if (postType) params.set('postType', postType);
      const url = `/api/posts?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        set({ posts: data.posts, postsLoading: false });
      } else {
        set({ postsLoading: false });
      }
    } catch {
      set({ postsLoading: false });
    }
  },

  loadPost: async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      if (res.ok) {
        set({ currentPost: data.post, userLikedCurrentPost: false });
      }
    } catch {
      // ignore
    }
  },

  createPost: async (postData) => {
    const state = get();
    if (!state.token) throw new Error('Not authenticated');
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(postData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create post');
    return data.post;
  },

  updatePost: async (id, postData) => {
    const state = get();
    if (!state.token) throw new Error('Not authenticated');
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(postData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update post');
    return data.post;
  },

  deletePost: async (id) => {
    const state = get();
    if (!state.token) throw new Error('Not authenticated');
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${state.token}` },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete post');
    }
  },

  toggleLike: async (postId) => {
    const state = get();
    if (!state.token || !state.isAuthenticated) return;
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${state.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const currentPost = get().currentPost;
        if (currentPost && currentPost.id === postId) {
          set({
            userLikedCurrentPost: data.liked,
            currentPost: {
              ...currentPost,
              _count: {
                ...currentPost._count!,
                likes: data.likeCount,
              },
            },
          });
        }
      }
    } catch {
      // ignore
    }
  },

  addComment: async (postId, content) => {
    const state = get();
    if (!state.token) throw new Error('Not authenticated');
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add comment');
    set({ currentPostComments: [data.comment, ...get().currentPostComments] });
  },

  loadComments: async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      if (res.ok) {
        set({ currentPostComments: data.comments });
      }
    } catch {
      // ignore
    }
  },

  // Profile
  profileData: null,
  profileLoading: false,

  loadProfile: async (username) => {
    set({ profileLoading: true });
    try {
      const res = await fetch(`/api/users/${username}`);
      const data = await res.json();
      if (res.ok) {
        set({ profileData: data, profileLoading: false });
      } else {
        set({ profileLoading: false });
      }
    } catch {
      set({ profileLoading: false });
    }
  },

  // My Posts
  myPosts: [],
  myPostsStats: null,
  myPostsLoading: false,

  loadMyPosts: async () => {
    const state = get();
    if (!state.token) return;
    set({ myPostsLoading: true });
    try {
      const res = await fetch('/api/users/me/posts', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        set({ myPosts: data.posts, myPostsStats: data.stats, myPostsLoading: false });
      } else {
        set({ myPostsLoading: false });
      }
    } catch {
      set({ myPostsLoading: false });
    }
  },

  // Premium
  showPremiumModal: false,
  setShowPremiumModal: (v) => set({ showPremiumModal: v }),

  activatePremium: async () => {
    const state = get();
    if (!state.token || !state.user) return;
    try {
      const res = await fetch('/api/premium/activate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${state.token}` },
      });
      if (res.ok) {
        set({
          user: { ...state.user, isPremium: true },
          showPremiumModal: false,
        });
      }
    } catch {
      // ignore
    }
  },

  // Cookie Consent
  cookieConsent: false,
  setCookieConsent: (v) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', String(v));
    }
    set({ cookieConsent: v });
  },

  // Donations
  currentPostDonations: [],
  currentPostTotalDonated: 0,
  donationLoading: false,
  showDonationModal: false,
  donationPostId: null,

  loadDonations: async (postId) => {
    set({ donationLoading: true });
    try {
      const res = await fetch(`/api/donations?postId=${postId}`);
      const data = await res.json();
      if (res.ok) {
        set({
          currentPostDonations: data.donations,
          currentPostTotalDonated: data.totalDonated,
          donationLoading: false,
        });
      } else {
        set({ donationLoading: false });
      }
    } catch {
      set({ donationLoading: false });
    }
  },

  createDonation: async (postId, amount, message) => {
    const state = get();
    if (!state.token) throw new Error('Not authenticated');
    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ postId, amount, message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create donation');
    await get().loadDonations(postId);
  },

  setShowDonationModal: (v) => set({ showDonationModal: v }),
  setDonationPostId: (id) => set({ donationPostId: id }),

  // Sponsorships
  sponsoredPosts: [],
  loadSponsoredPosts: async () => {
    try {
      const res = await fetch('/api/sponsorships?active=true');
      const data = await res.json();
      if (res.ok) {
        set({ sponsoredPosts: data.posts || [] });
      }
    } catch {
      // ignore
    }
  },

  createSponsorship: async (postId, amount, duration) => {
    const state = get();
    if (!state.token) throw new Error('Not authenticated');
    const res = await fetch('/api/sponsorships', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ postId, amount, duration }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create sponsorship');
    await get().loadSponsoredPosts();
  },

  showSponsorModal: false,
  setShowSponsorModal: (v) => set({ showSponsorModal: v }),
  sponsorPostId: null,
  setSponsorPostId: (id) => set({ sponsorPostId: id }),

  // Search Filters
  searchFilter: 'all',
  setSearchFilter: (filter) => set({ searchFilter: filter }),

  showSearchOverlay: false,
  setShowSearchOverlay: (v) => set({ showSearchOverlay: v }),

  // Earnings Dashboard
  earningsData: null,
  loadEarnings: async () => {
    const state = get();
    if (!state.token) return;
    try {
      const res = await fetch('/api/earnings', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        set({ earningsData: data });
      }
    } catch {
      // ignore
    }
  },

  // Seeded
  seeded: false,
  setSeeded: (v) => set({ seeded: v }),
}));
