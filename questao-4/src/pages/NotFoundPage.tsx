import { Link } from 'react-router-dom'
import { DEFAULT_AUTHENTICATED_ROUTE } from '../routes/PublicOnlyRoute'

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-content-muted uppercase">
          Erro 404
        </p>

        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-content">
          Página não encontrada
        </h1>

        <p className="mt-2 text-sm text-content-muted">
          O endereço acessado não existe nesta aplicação.
        </p>

        <Link
          to={DEFAULT_AUTHENTICATED_ROUTE}
          className="mt-6 inline-block rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-contrast transition-colors hover:bg-brand-hover"
        >
          Voltar para os produtos
        </Link>
      </div>
    </div>
  )
}
