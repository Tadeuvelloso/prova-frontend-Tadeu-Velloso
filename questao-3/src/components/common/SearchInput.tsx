interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="w-full sm:w-auto">
      <label htmlFor="product-search" className="sr-only">
        Pesquisar produtos
      </label>

      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-content transition-colors placeholder:text-content-muted focus:border-brand sm:w-72"
      />
    </div>
  )
}
