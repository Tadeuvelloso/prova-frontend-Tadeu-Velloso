import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { SnackbarToast } from '../components/common/SnackbarToast'
import { queryClient } from '../config/queryClient'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        Components={{
          default: SnackbarToast,
          success: SnackbarToast,
          error: SnackbarToast,
          info: SnackbarToast,
          warning: SnackbarToast,
        }}
        preventDuplicate
        maxSnack={3}
        // No rodapé o snackbar cobria a linha de ações dos formulários, que
        // também fica à direita, e o clique não chegava ao botão.
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {children}
      </SnackbarProvider>
    </QueryClientProvider>
  )
}
