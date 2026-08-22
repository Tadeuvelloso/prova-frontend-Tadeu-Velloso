import { useMutation } from '@tanstack/react-query'
import { login } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials, LoginResponse } from '../types/auth'
import type { AppError } from '../utils/errorHandler'

/**
 * Autentica e grava a sessão.
 *
 * O componente não conhece Axios, nem o formato da resposta, nem o store:
 * chama `mutate(credenciais)` e observa `isPending` e `error`. Se o contrato
 * do backend mudar, muda aqui e o formulário continua igual.
 *
 * O erro não vira toast: fica em `error` para a tela mostrar junto do
 * formulário, onde o usuário está olhando.
 */
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation<LoginResponse, AppError, LoginCredentials>({
    mutationFn: login,
    onSuccess: setSession,
  })
}
