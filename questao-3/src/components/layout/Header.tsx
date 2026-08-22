export function Header() {
  return (
    <header className="border-b border-border-subtle bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold text-content">Catálogo de Produtos</h1>
        <p className="mt-1 text-sm text-content-muted">
          Dados consumidos da Fake Store API.
        </p>
      </div>
    </header>
  )
}
