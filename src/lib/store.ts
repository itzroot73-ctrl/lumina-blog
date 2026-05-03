import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  bio?: string | null;
  avatar?: string | null;
  role: string;
  isPremium: boolean;
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
  };
  posts: Post[];
}

export const CATEGORIES = ['All', 'Tech', 'Design', 'Art', 'Lifestyle', 'Science', 'Business'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Tech: { bg: 'rgba(0,240,255,0.12)', text: '#00f0ff', border: 'rgba(0,240,255,0.25)' },
  Design: { bg: 'rgba(168,85,247,0.12)', text: '#a855f7', border: 'rgba(168,85,247,0.25)' },
  Art: { bg: 'rgba(244,63,94,0.12)', text: '#f43f5e', border: 'rgba(244,63,94,0.25)' },
  Lifestyle: { bg: 'rgba(16,185,129,0.12)', text: '#10b981', border: 'rgba(16,185,129,0.25)' },
  Science: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
  Business: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
};

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; name: string; username: string; password: string; role?: string }) => Promise<void>;
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
  loadPosts: (search?: string, category?: string) => Promise<void>;
  loadPost: (id: string) => Promise<void>;
  createPost: (data: { title: string; excerpt?: string; content: string; thumbnail?: string; category?: string; published?: boolean; readingTime?: number }) => Promise<Post>;
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
  myPostsStats: { totalPosts: number; publishedPosts: number; draftPosts: number; totalViews: number; totalLikes: number } | null;
  myPostsLoading: boolean;
  loadMyPosts: () => Promise<void>;

  // Premium
  showPremiumModal: boolean;
  setShowPremiumModal: (v: boolean) => void;
  activatePremium: () => Promise<void>;

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

  loadPosts: async (search, category) => {
    set({ postsLoading: true });
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category && category !== 'All') params.set('category', category);
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

  // Seeded
  seeded: false,
  setSeeded: (v) => set({ seeded: v }),
}));

// Debounce utility hook
export function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  }) as T;
}
