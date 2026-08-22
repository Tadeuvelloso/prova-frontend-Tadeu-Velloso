import { QueryClient } from '@tanstack/react-query'
import { AppError } from '../utils/errorHandler'

/**
 * O catálogo da Fake Store é estático, então vale um `staleTime` alto: trocar
 * de categoria e voltar não dispara nova requisição, os dados vêm do cache.
 */
const FIVE_MINUTES = 1000 * 60 * 5

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // 4xx é erro de quem pediu: repetir devolve o mesmo resultado.
        // Só falha de rede e 5xx justificam nova tentativa.
        const status = error instanceof AppError ? error.status : undefined
        if (status && status >= 400 && status < 500) return false

        return failureCount < 2
      },
    },
  },
})
