interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const buttonClass =
    'rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-sm text-content transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-subtle disabled:hover:text-content'

  return (
    <nav aria-label="Paginação" className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={buttonClass}
      >
        Anterior
      </button>

      <span aria-live="polite" className="text-sm text-content-muted">
        Página {page} de {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={buttonClass}
      >
        Próxima
      </button>
    </nav>
  )
}
