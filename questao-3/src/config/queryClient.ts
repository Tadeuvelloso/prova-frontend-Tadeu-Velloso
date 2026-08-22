import { QueryClient } from '@tanstack/react-query'
import { AppError } from '../utils/errorHandler'

const FIVE_MINUTES = 1000 * 60 * 5

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
      refetchOnWindowFocus: false,
      // 4xx é erro de quem pediu: repetir devolve o mesmo resultado.
      retry: (failureCount, error) => {
        const status = error instanceof AppError ? error.status : undefined
        if (status && status >= 400 && status < 500) return false

        return failureCount < 2
      },
    },
  },
})
