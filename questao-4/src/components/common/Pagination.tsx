import { Select } from './Select'
import { PAGE_SIZE_OPTIONS } from '../../utils/constants'

interface PaginationProps {
  page: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const PAGE_SIZE_SELECT_OPTIONS = PAGE_SIZE_OPTIONS.map((size) => ({
  value: String(size),
  label: `${size} por página`,
}))

export function Pagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const first = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, totalItems)

  return (
    <nav
      aria-label="Paginação da lista de produtos"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <Select
          label="Itens por página"
          hideLabel
          value={String(pageSize)}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          options={PAGE_SIZE_SELECT_OPTIONS}
          className="w-auto"
        />

        {/*
          Intervalo em vez de só o número da página: "6–10 de 23" responde
          onde a pessoa está na lista, que é a pergunta real. "Página 2"
          sozinho não diz quanto falta.
        */}
        <p aria-live="polite" className="font-mono text-xs text-content-muted tabular-nums">
          {first}–{last} de {totalItems}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <PageButton onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Anterior
        </PageButton>

        <span className="font-mono text-xs text-content-muted tabular-nums">
          <span className="sr-only">Página </span>
          {page}
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> de </span>
          {totalPages}
        </span>

        <PageButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Próxima
        </PageButton>
      </div>
    </nav>
  )
}

function PageButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled: boolean
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-border-strong bg-surface px-3 py-1.5 text-sm text-content transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-content"
    >
      {children}
    </button>
  )
}
