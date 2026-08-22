import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../services/authService'
import { queryKeys } from '../config/queryKeys'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials, LoginResponse } from '../types/auth'
import type { AppError } from '../utils/errorHandler'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, AppError, LoginCredentials>({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session)

      // Semear o cache evita que o AuthProvider revalide com /auth/me um
      // token recém-emitido, e o splash pisque a cada login.
      queryClient.setQueryData(queryKeys.authMe, session.user)
    },
  })
}
