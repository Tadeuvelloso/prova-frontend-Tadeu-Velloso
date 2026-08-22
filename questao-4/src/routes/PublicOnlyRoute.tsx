import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const DEFAULT_AUTHENTICATED_ROUTE = '/produtos'

interface LocationState {
  from?: { pathname?: string }
}

/**
 * O espelho do `ProtectedRoute`: barra quem já está autenticado.
 *
 * Serve a dois casos. Voltar ao `/login` com sessão ativa não faz sentido — é
 * um beco sem saída para o usuário. E é aqui que o redirecionamento pós-login
 * acontece: quando a mutação grava o token, este componente re-renderiza e
 * navega. Por isso a `LoginPage` não precisa chamar `navigate()`; ela só
 * autentica, e a consequência é declarativa.
 *
 * O destino é o que o `ProtectedRoute` guardou em `state.from`, devolvendo o
 * usuário à página que ele tentou abrir.
 */
export function PublicOnlyRoute() {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  if (token) {
    const state = location.state as LocationState | null
    const destination = state?.from?.pathname ?? DEFAULT_AUTHENTICATED_ROUTE

    return <Navigate to={destination} replace />
  }

  return <Outlet />
}
