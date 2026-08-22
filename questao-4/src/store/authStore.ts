import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse, User } from '../types/auth'

export const AUTH_STORAGE_KEY = 'questao-4-auth'

interface AuthState {
  token: string | null
  user: User | null

  setSession: (session: LoginResponse) => void

  setUser: (user: User) => void

  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setSession: ({ accessToken, user }) => set({ token: accessToken, user }),

      setUser: (user) => set({ user }),

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
)
