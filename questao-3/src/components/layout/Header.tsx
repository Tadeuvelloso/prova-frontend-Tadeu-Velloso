import { API_CONFIG } from '../../config/api.config'

export function Header() {
  const source = API_CONFIG.baseURL.replace('https://', '')

  return (
    <header className="border-b border-border-subtle bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-7">
        <p className="font-mono text-xs tracking-[0.2em] text-content-muted uppercase">
          {source}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-content">
          Catálogo de produtos
        </h1>
      </div>
    </header>
  )
}
