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
      {/*
        Atalho para quem navega por teclado: sem ele, chegar à tabela exige
        passar pelo cabeçalho a cada troca de página. Fica invisível até
        receber foco, que é a primeira parada da navegação por Tab.
      */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-contrast"
      >
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo" className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
