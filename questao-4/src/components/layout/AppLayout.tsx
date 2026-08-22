import { Outlet } from 'react-router-dom'
import { Header } from './Header'

/**
 * Moldura das telas autenticadas.
 *
 * Fica dentro do `ProtectedRoute` e envolve as rotas internas, então o
 * cabeçalho não pisca entre navegações — só o `Outlet` troca.
 */
export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
