import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@agrochain/api'
import type { User } from './types'

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setToken: (token) => {
        set({ token });
        if (typeof window !== 'undefined') {
          localStorage.setItem('agrochain_token', token);
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('agrochain_token');
          localStorage.removeItem('agrochain_user');
          // Don't use clear() as it might wipe other app data
        }
      },

      loadFromStorage: async () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('agrochain_token');
          if (token) {
            set({ token });
            try {
              const response = await authAPI.getMe();
              if (response.data && response.data.user) {
                set({ user: response.data.user, isAuthenticated: true });
              }
            } catch (error) {
              get().logout();
            }
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);