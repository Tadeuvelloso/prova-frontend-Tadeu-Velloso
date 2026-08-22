import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * Fecha o acesso às telas internas.
 *
 * Observa o token no store, então funciona nos dois sentidos sem ninguém
 * mandar navegar: quem chega sem sessão é levado ao login, e quem tem a
 * sessão derrubada no meio do uso — o interceptor apagando o token depois de
 * um 401 — é levado junto, porque este componente re-renderiza.
 *
 * O destino original viaja em `state.from`. Sem isso, quem abre um link
 * direto para um produto cairia na listagem depois de entrar, e teria que
 * procurar de novo o que já tinha pedido.
 */
export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
