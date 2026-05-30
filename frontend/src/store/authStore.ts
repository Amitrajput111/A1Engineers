import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  xp: number;
  streak: number;
  completedLessons?: string[];
  currentCourseId?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  loginSuccess: (user: UserProfile, token: string) => void;
  logoutSuccess: () => void;
  setLoading: (isLoading: boolean) => void;
}

// Pre-configured default guest developer profile
const mockUser: UserProfile = {
  id: '60d5ec49f83c2c1a403d12f3',
  name: 'Amit Rajput',
  email: 'amit.rajput.oauth@gmail.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120',
  xp: 150,
  streak: 3,
  completedLessons: [],
  currentCourseId: 'dsa/arrays-basics'
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  token: 'mock-auth-token-key-2026',
  isAuthenticated: true,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setError: (error) => set({ error }),
  loginSuccess: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, error: null });
  },
  logoutSuccess: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));
