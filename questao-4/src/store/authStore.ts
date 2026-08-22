import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse, User } from '../types/auth'

export const AUTH_STORAGE_KEY = 'questao-4-auth'

interface AuthState {
  token: string | null
  user: User | null

  /** Grava a sessão inteira após um login bem-sucedido. */
  setSession: (session: LoginResponse) => void

  /**
   * Atualiza só o usuário, mantendo o token. Usado quando `/auth/me` responde
   * no boot: o papel pode ter mudado no servidor desde o login, e as
   * permissões da interface não podem ficar presas ao que foi gravado antes.
   */
  setUser: (user: User) => void

  logout: () => void
}

/**
 * Fonte única de verdade da autenticação.
 *
 * O `persist` sincroniza com o localStorage sozinho — não há
 * `localStorage.setItem` nem `getItem` espalhado pelo código, que é o padrão
 * que descrevi na Questão 1. Quem lê o token para montar o header é o
 * interceptor do Axios, via `useAuthStore.getState()`, sem passar por hook.
 */
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
      // Sem `partialize` o middleware tentaria serializar o estado inteiro.
      // Persistir apenas os dados deixa explícito o que sobrevive ao reload.
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
)
