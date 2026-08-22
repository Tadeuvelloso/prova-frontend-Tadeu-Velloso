interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  disabled?: boolean
}

export function Select({ id, label, value, options, onChange, disabled }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-content capitalize outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60 sm:w-auto"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
