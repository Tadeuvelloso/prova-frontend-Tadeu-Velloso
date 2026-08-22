import { Button } from '../../common/Button'
import { Input } from '../../common/Input'
import { Select, type SelectOption } from '../../common/Select'
import type { ProductStatusFilter } from '../../../types/product'

const STATUS_OPTIONS: readonly SelectOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
]

interface ProductsFiltersProps {
  name: string
  onNameChange: (value: string) => void
  minPrice: string
  onMinPriceChange: (value: string) => void
  maxPrice: string
  onMaxPriceChange: (value: string) => void
  status: ProductStatusFilter
  onStatusChange: (value: ProductStatusFilter) => void
  hasInvertedRange: boolean
  hasActiveFilters: boolean
  onClear: () => void
}

export function ProductsFilters({
  name,
  onNameChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  status,
  onStatusChange,
  hasInvertedRange,
  hasActiveFilters,
  onClear,
}: ProductsFiltersProps) {
  return (
    <search className="rounded-lg border border-border-subtle bg-surface p-4 shadow-card">
      <div className="grid gap-4 sm:grid-cols-[minmax(8rem,1fr)_6.5rem_6.5rem_8.5rem]">
        <Input
          label="Nome do produto"
          type="search"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Buscar por nome…"
        />

        <Input
          label="Preço mínimo"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={minPrice}
          onChange={(event) => onMinPriceChange(event.target.value)}
          placeholder="0,00"
        />

        <Input
          label="Preço máximo"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          placeholder="Sem limite"
        />

        <Select
          label="Status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value as ProductStatusFilter)}
          options={STATUS_OPTIONS}
        />
      </div>

      {hasInvertedRange && (
        <p role="alert" className="mt-3 text-xs text-danger">
          O preço mínimo está acima do máximo — nenhum produto cabe nessa faixa.
        </p>
      )}

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClear}>
            Limpar filtros
          </Button>
        </div>
      )}
    </search>
  )
}
