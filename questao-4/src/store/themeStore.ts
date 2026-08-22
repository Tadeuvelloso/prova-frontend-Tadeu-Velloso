import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

/**
 * Mesma chave lida pelo script inline do `index.html`, que aplica o tema antes
 * da primeira pintura. Se mudar aqui, mudar lá.
 */
export const THEME_STORAGE_KEY = 'questao-4-theme'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/** Primeira visita não tem preferência salva: herda a do sistema operacional. */
function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * O tema é um atributo no `<html>`, não estado de componente: quem reage a ele
 * é o CSS, redefinindo as variáveis de `styles/theme.css`. Por isso a escrita
 * no DOM acontece aqui, no store, e não num efeito espalhado pela árvore.
 */
function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },

      toggleTheme: () => {
        get().setTheme(get().theme === 'dark' ? 'light' : 'dark')
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      // A rehidratação sobrescreve o valor inicial vindo do sistema, então o
      // DOM precisa ser sincronizado depois que ela acontece.
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)
