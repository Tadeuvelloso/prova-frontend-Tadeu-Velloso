import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { UserRole } from '../types/auth'
import { notify } from '../utils/notify'
import { DEFAULT_AUTHENTICATED_ROUTE } from './PublicOnlyRoute'

interface RoleRouteProps {
  allow: readonly UserRole[]
}

export function RoleRoute({ allow }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user)
  const isAllowed = user ? allow.includes(user.role) : false

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
