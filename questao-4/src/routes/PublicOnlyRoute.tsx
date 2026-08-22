import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const DEFAULT_AUTHENTICATED_ROUTE = '/produtos'

interface LocationState {
  from?: { pathname?: string }
}

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
