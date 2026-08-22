import { useEffect, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../config/queryKeys'
import { getMe } from '../services/authService'
import { useAuthStore } from '../store/authStore'

/**
 * Valida a sessão persistida antes de liberar a aplicação.
 *
 * Um token guardado no localStorage é uma promessa, não uma garantia: pode ter
 * expirado, ter sido revogado, ou o usuário pode ter sido desativado enquanto
 * a aba estava fechada. Sem esta checagem, a aplicação renderizaria as telas
 * internas confiando numa string, e só descobriria o problema na primeira
 * requisição — depois de já ter mostrado uma interface que o usuário não
 * podia ver.
 *
 * Se o token for recusado, o interceptor do Axios encerra a sessão, o token
 * some do store e o `ProtectedRoute` leva ao login. Nada disso precisa ser
 * orquestrado aqui.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)

  const { data, isPending } = useQuery({
    queryKey: queryKeys.authMe,
    queryFn: getMe,
    // Sem token não há o que validar — e é o caso de quem abre o login.
    enabled: Boolean(token),
    // Token recusado não melhora na segunda tentativa; repetir só atrasaria
    // o redirecionamento para o login.
    retry: false,
    // O usuário não muda durante a sessão. Revalidar a cada montagem seria
    // requisição sem motivo.
    staleTime: Infinity,
  })

  /**
   * O papel vem do servidor, não do que foi gravado no login: se ele mudou
   * desde então, as permissões da interface precisam acompanhar.
   */
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
        // Anuncia a espera a quem usa leitor de tela, em vez de deixar a tela
        // silenciosa até a aplicação aparecer.
        role="status"
        className="font-mono text-xs tracking-[0.2em] text-content-muted uppercase"
      >
        Verificando sessão…
      </p>
    </div>
  )
}
