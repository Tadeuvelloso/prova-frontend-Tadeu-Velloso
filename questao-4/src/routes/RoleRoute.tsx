import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { UserRole } from '../types/auth'
import { notify } from '../utils/notify'
import { DEFAULT_AUTHENTICATED_ROUTE } from './PublicOnlyRoute'

interface RoleRouteProps {
  allow: readonly UserRole[]
}

/**
 * Restringe rotas por papel.
 *
 * A interface já esconde os botões que o papel não permite, mas esconder não
 * é impedir: `/produtos/novo` continua sendo um endereço que alguém pode
 * digitar ou receber por link. Esta guarda cobre esse caminho.
 *
 * Continua sendo experiência de uso, não segurança — quem autoriza de fato é
 * o backend, e ele devolveria 403 mesmo se a tela abrisse. O que se ganha é
 * não levar a pessoa até um formulário que ela não conseguiria salvar.
 */
export function RoleRoute({ allow }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user)
  const isAllowed = user ? allow.includes(user.role) : false

  /**
   * Redirecionar calado deixaria a impressão de link quebrado. O aviso vai
   * num efeito porque emitir feedback durante a renderização é efeito
   * colateral no meio do render.
   */
  useEffect(() => {
    if (!isAllowed) {
      notify.error('Você não tem permissão para acessar esta página.')
    }
  }, [isAllowed])

  if (!isAllowed) {
    return <Navigate to={DEFAULT_AUTHENTICATED_ROUTE} replace />
  }

  return <Outlet />
}
