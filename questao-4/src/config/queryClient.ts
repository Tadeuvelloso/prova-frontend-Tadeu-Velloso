import { QueryClient } from '@tanstack/react-query'
import { AppError } from '../utils/errorHandler'

const THIRTY_SECONDS = 1000 * 30

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: THIRTY_SECONDS,

      refetchOnWindowFocus: false,

      retry: (failureCount, error) => {
        const status = error instanceof AppError ? error.status : undefined
        if (status && status >= 400 && status < 500) return false

        return failureCount < 2
      },
    },

    mutations: {
      // Um POST que falhou por timeout pode ter chegado ao servidor mesmo
      // assim; repetir criaria o produto duas vezes.
      retry: false,
    },
  },
})
