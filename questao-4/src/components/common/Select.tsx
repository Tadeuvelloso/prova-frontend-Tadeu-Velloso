import { useId, type SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string
  options: readonly SelectOption[]
  hideLabel?: boolean
}

export function Select({
  label,
  options,
  hideLabel = false,
  id,
  className = '',
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className={hideLabel ? 'sr-only' : 'block text-sm font-medium text-content'}
      >
        {label}
      </label>

      <select
        id={selectId}
        className={`w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-content transition-colors focus:border-brand ${className}`}
        {...props}
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
