import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '../types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      setTokens: (tokens) => set({ tokens }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      login: (user, tokens) => {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        set({
          user,
          tokens,
          isAuthenticated: true,
          error: null,
        });
      },
      
      logout: () => {
        // Clear tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
