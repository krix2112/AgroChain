import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@agrochain/api'
import type { User } from './types'

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  fpoId: string | null;
  organizationName: string | null;
  role: 'fpo_manager' | 'buyer' | 'transporter' | 'farmer' | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setFPOContext: (fpoId: string, organizationName: string) => void;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      fpoId: null,
      organizationName: null,
      role: null,

      setUser: (user) => set({ user, isAuthenticated: true, role: user.role }),

      setFPOContext: (fpoId, organizationName) => set({ fpoId, organizationName }),

      setToken: (token) => {
        set({ token });
        if (typeof window !== 'undefined') {
          localStorage.setItem('agrochain_token', token);
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          fpoId: null, 
          organizationName: null, 
          role: null 
        });
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
                const user = response.data.user;
                set({ user, isAuthenticated: true, role: user.role });
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
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        fpoId: state.fpoId, 
        organizationName: state.organizationName,
        role: state.role
      }),
    }
  )
);