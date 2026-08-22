import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../services/authService'
import { queryKeys } from '../config/queryKeys'
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
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, AppError, LoginCredentials>({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session)

      /**
       * Semeia o cache com o usuário que o login acabou de devolver.
       *
       * Sem isto, gravar o token faz o `AuthProvider` disparar `/auth/me`
       * para validar um token recém-emitido — uma requisição redundante, e
       * um "Verificando sessão…" piscando na cara de quem acabou de entrar.
       * Com o cache preenchido, a query nasce resolvida (o `staleTime` é
       * infinito) e a validação continua valendo só para o caso que importa:
       * token restaurado do localStorage, cuja validade é desconhecida.
       */
      queryClient.setQueryData(queryKeys.authMe, session.user)
    },
  })
}
