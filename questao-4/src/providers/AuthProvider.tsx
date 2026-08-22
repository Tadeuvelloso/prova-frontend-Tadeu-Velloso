import { useEffect, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../config/queryKeys'
import { getMe } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)

  const { data, isPending } = useQuery({
    queryKey: queryKeys.authMe,
    queryFn: getMe,
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (data) setUser(data)
  }, [data, setUser])

  if (token && isPending) {
    return <SessionSplash />
  }

  return children
}

function SessionSplash() {
  return (
    <div className="grid min-h-screen place-items-center">
      <p
        role="status"
        className="font-mono text-xs tracking-[0.2em] text-content-muted uppercase"
      >
        Verificando sessão…
      </p>
    </div>
  )
}
